using FluentAssertions;
using Moq;
using Printodome.Application.Common.Interfaces;
using Printodome.Application.DTOs;
using Printodome.Application.Services;
using Printodome.Domain.Entities;
using Printodome.Domain.Enums;
using Printodome.Domain.Exceptions;
using Xunit;

namespace Printodome.Tests;

/// <summary>
/// Unit tests demonstrating business rule verification, stock invariant enforcement,
/// and transaction rollbacks using xUnit, Moq, and FluentAssertions.
/// </summary>
public class OrderProcessingServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IProductRepository> _mockProductRepo;
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly Mock<ICustomerRepository> _mockCustomerRepo;
    private readonly OrderProcessingService _orderService;

    public OrderProcessingServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockProductRepo = new Mock<IProductRepository>();
        _mockOrderRepo = new Mock<IOrderRepository>();
        _mockCustomerRepo = new Mock<ICustomerRepository>();

        _mockUnitOfWork.Setup(u => u.Products).Returns(_mockProductRepo.Object);
        _mockUnitOfWork.Setup(u => u.Orders).Returns(_mockOrderRepo.Object);
        _mockUnitOfWork.Setup(u => u.Customers).Returns(_mockCustomerRepo.Object);

        _orderService = new OrderProcessingService(_mockUnitOfWork.Object);
    }

    [Fact]
    public async Task PlaceOrderAsync_WithSufficientStock_ShouldDeductStockAndCommitOrder()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product(
            "HP LaserJet Enterprise M507x",
            "HP-LJE-M507X",
            "Monochrome enterprise laser",
            899.99m,
            10,
            ProductCategory.Printers,
            "HP",
            "https://example.com/hp.jpg");

        // Reflect ID to match
        typeof(Product).BaseType!.GetProperty("Id")!.SetValue(product, productId);

        _mockProductRepo.Setup(r => r.GetByIdsAsync(It.IsAny<IEnumerable<Guid>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Product> { product });

        _mockCustomerRepo.Setup(r => r.GetByEmailAsync("buyer@corp.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Customer("Alice", "Smith", "buyer@corp.com", "555-1234", "123 Corp Way", "Austin", "TX", "78701"));

        var request = new CreateOrderRequest(
            new CustomerRequest("Alice", "Smith", "buyer@corp.com", "555-1234", "123 Corp Way", "Austin", "TX", "78701"),
            new List<OrderItemRequest>
            {
                new(productId, Quantity: 3)
            },
            "123 Corp Way, Austin, TX",
            "123 Corp Way, Austin, TX",
            "STRIPE-TOKEN-001");

        // Act
        var result = await _orderService.PlaceOrderAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(1);
        result.Items[0].Quantity.Should().Be(3);
        result.TotalAmount.Should().Be(899.99m * 3);
        result.Status.Should().Be(OrderStatus.Processing);

        // Verify stock deducted from 10 down to 7
        product.StockQuantity.Should().Be(7);

        // Verify transaction commits
        _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task PlaceOrderAsync_WhenRequestedStockExceedsAvailable_ShouldThrowInsufficientStockExceptionAndRollback()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product(
            "HP 58A Toner Cartridge",
            "HP-CF258A",
            "Monochrome toner",
            116.99m,
            2, // Only 2 in stock
            ProductCategory.TonerCartridges,
            "HP",
            "https://example.com/toner.jpg");

        typeof(Product).BaseType!.GetProperty("Id")!.SetValue(product, productId);

        _mockProductRepo.Setup(r => r.GetByIdsAsync(It.IsAny<IEnumerable<Guid>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Product> { product });

        var request = new CreateOrderRequest(
            new CustomerRequest("Bob", "Jones", "bob@example.com", "555-4321", "456 Main St", "Dallas", "TX", "75001"),
            new List<OrderItemRequest>
            {
                new(productId, Quantity: 5) // Requesting 5!
            },
            "456 Main St",
            "456 Main St");

        // Act
        var act = async () => await _orderService.PlaceOrderAsync(request);

        // Assert
        await act.Should().ThrowAsync<InsufficientStockException>()
            .WithMessage("*Insufficient stock for product SKU 'HP-CF258A'*");

        // Verify stock untouched
        product.StockQuantity.Should().Be(2);

        // Verify rollback invoked
        _mockUnitOfWork.Verify(u => u.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task PlaceOrderAsync_WhenProductNotFound_ShouldThrowProductNotFoundException()
    {
        // Arrange
        var missingProductId = Guid.NewGuid();

        _mockProductRepo.Setup(r => r.GetByIdsAsync(It.IsAny<IEnumerable<Guid>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Product>()); // Empty product catalog result

        var request = new CreateOrderRequest(
            new CustomerRequest("Charlie", "Brown", "charlie@example.com", "555-9999", "789 Pine", "Denver", "CO", "80201"),
            new List<OrderItemRequest>
            {
                new(missingProductId, Quantity: 1)
            },
            "789 Pine",
            "789 Pine");

        // Act
        var act = async () => await _orderService.PlaceOrderAsync(request);

        // Assert
        await act.Should().ThrowAsync<ProductNotFoundException>();
        _mockUnitOfWork.Verify(u => u.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task PlaceOrderAsync_WhenConcurrencyConflictOccurs_ShouldRollbackAndThrow()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product("Canon imageCLASS", "CAN-IC", "Desc", 300m, 10, ProductCategory.Printers, "Canon", "url");
        typeof(Product).BaseType!.GetProperty("Id")!.SetValue(product, productId);

        _mockProductRepo.Setup(r => r.GetByIdsAsync(It.IsAny<IEnumerable<Guid>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Product> { product });

        // Simulate optimistic concurrency exception thrown during commit
        _mockUnitOfWork.Setup(u => u.CommitAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new ConcurrencyConflictException("Optimistic concurrency collision on Product RowVersion."));

        var request = new CreateOrderRequest(
            new CustomerRequest("Dave", "Clark", "dave@corp.com", "555-0000", "500 Oak St", "Miami", "FL", "33101"),
            new List<OrderItemRequest> { new(productId, 2) },
            "500 Oak St",
            "500 Oak St");

        // Act
        var act = async () => await _orderService.PlaceOrderAsync(request);

        // Assert
        await act.Should().ThrowAsync<ConcurrencyConflictException>();
        _mockUnitOfWork.Verify(u => u.RollbackTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
