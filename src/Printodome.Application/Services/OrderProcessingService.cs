using Printodome.Application.Common.Interfaces;
using Printodome.Application.DTOs;
using Printodome.Domain.Entities;
using Printodome.Domain.Enums;
using Printodome.Domain.Exceptions;

namespace Printodome.Application.Services;

public interface IOrderProcessingService
{
    Task<OrderDto> PlaceOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default);
    Task<OrderDto> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OrderDto> GetOrderByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
}

public class OrderProcessingService : IOrderProcessingService
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderProcessingService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes atomic order placement with inventory deduction and optimistic concurrency safeguard.
    /// In an enterprise environment, this runs within a database transaction boundary.
    /// </summary>
    public async Task<OrderDto> PlaceOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        if (request.Items == null || !request.Items.Any())
            throw new DomainException("Order must contain at least one item.");

        if (string.IsNullOrWhiteSpace(request.Customer.Email))
            throw new DomainException("Customer email address is required.");

        // Begin transaction to ensure atomic execution across inventory and order tables
        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            // 1. Resolve or register Customer entity
            var customer = await _unitOfWork.Customers.GetByEmailAsync(request.Customer.Email, cancellationToken);
            if (customer == null)
            {
                customer = new Customer(
                    request.Customer.FirstName,
                    request.Customer.LastName,
                    request.Customer.Email,
                    request.Customer.PhoneNumber,
                    request.Customer.Address,
                    request.Customer.City,
                    request.Customer.State,
                    request.Customer.PostalCode);

                await _unitOfWork.Customers.AddAsync(customer, cancellationToken);
            }

            // 2. Instantiate aggregate root Order
            var order = new Order(
                customer.Id,
                request.ShippingAddress,
                request.BillingAddress,
                request.PaymentReference);

            // 3. Validate stock and atomically deduct inventory per line item
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _unitOfWork.Products.GetByIdsAsync(productIds, cancellationToken);
            var productMap = products.ToDictionary(p => p.Id);

            foreach (var itemReq in request.Items)
            {
                if (itemReq.Quantity <= 0)
                    throw new DomainException($"Invalid quantity {itemReq.Quantity} for product ID {itemReq.ProductId}.");

                if (!productMap.TryGetValue(itemReq.ProductId, out var product))
                    throw new ProductNotFoundException(itemReq.ProductId);

                if (!product.IsActive)
                    throw new DomainException($"Product '{product.Name}' ({product.SKU}) is currently unavailable.");

                // Domain invariant: verifies available stock and deducts atomically
                product.DeductStock(itemReq.Quantity);

                // Add snapshot item to order aggregate
                order.AddItem(product.Id, product.Name, product.SKU, product.Price, itemReq.Quantity);
            }

            // 4. Mark order as processing and persist
            order.MarkAsProcessing();
            await _unitOfWork.Orders.AddAsync(order, cancellationToken);

            // 5. Commit changes to DbContext (triggers EF Core RowVersion verification)
            await _unitOfWork.CommitAsync(cancellationToken);

            // 6. Complete database transaction
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return MapToDto(order, customer);
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task<OrderDto> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(id, cancellationToken);
        if (order == null)
            throw new DomainException($"Order with ID '{id}' was not found.");

        var customer = await _unitOfWork.Customers.GetByIdAsync(order.CustomerId, cancellationToken);
        return MapToDto(order, customer);
    }

    public async Task<OrderDto> GetOrderByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default)
    {
        var order = await _unitOfWork.Orders.GetByOrderNumberAsync(orderNumber, cancellationToken);
        if (order == null)
            throw new DomainException($"Order '{orderNumber}' was not found.");

        var customer = await _unitOfWork.Customers.GetByIdAsync(order.CustomerId, cancellationToken);
        return MapToDto(order, customer);
    }

    private static OrderDto MapToDto(Order o, Customer? c)
    {
        var customerDto = c != null
            ? new CustomerDto(c.Id, c.FirstName, c.LastName, c.Email, c.PhoneNumber, c.Address, c.City, c.State, c.PostalCode)
            : null;

        var itemsDto = o.Items.Select(i => new OrderItemDto(
            i.ProductId,
            i.ProductName,
            i.ProductSKU,
            i.UnitPrice,
            i.Quantity,
            i.TotalPrice)).ToList();

        return new OrderDto(
            o.Id,
            o.OrderNumber,
            o.CustomerId,
            customerDto,
            o.OrderDateUtc,
            o.Status,
            o.Status.ToString(),
            o.TotalAmount,
            o.ShippingAddress,
            o.BillingAddress,
            o.PaymentReference,
            itemsDto);
    }
}

