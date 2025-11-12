using Printodome.Domain.Common;
using Printodome.Domain.Enums;
using Printodome.Domain.Exceptions;

namespace Printodome.Domain.Entities;

/// <summary>
/// Aggregate root representing an e-commerce order with audit trails and concurrency protection.
/// </summary>
public class Order : BaseEntity
{
    public string OrderNumber { get; private set; } = string.Empty;
    public Guid CustomerId { get; private set; }
    public Customer? Customer { get; private set; }
    public DateTime OrderDateUtc { get; private set; } = DateTime.UtcNow;
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; private set; }
    public string ShippingAddress { get; private set; } = string.Empty;
    public string BillingAddress { get; private set; } = string.Empty;
    public string? PaymentReference { get; private set; }

    public byte[] RowVersion { get; private set; } = Array.Empty<byte>();

    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private Order() { }

    public Order(Guid customerId, string shippingAddress, string billingAddress, string? paymentReference = null)
    {
        CustomerId = customerId;
        ShippingAddress = shippingAddress;
        BillingAddress = billingAddress;
        PaymentReference = paymentReference;
        OrderNumber = GenerateOrderNumber();
        Status = OrderStatus.Pending;
        OrderDateUtc = DateTime.UtcNow;
    }

    public void AddItem(Guid productId, string productName, string productSku, decimal unitPrice, int quantity)
    {
        if (Status != OrderStatus.Pending)
            throw new DomainException($"Cannot add items to an order with status {Status}.");

        var item = new OrderItem(productId, productName, productSku, unitPrice, quantity);
        item.AttachOrder(Id);
        _items.Add(item);

        RecalculateTotal();
    }

    public void MarkAsProcessing()
    {
        if (Status != OrderStatus.Pending)
            throw new DomainException($"Cannot transition order from {Status} to Processing.");

        Status = OrderStatus.Processing;
        SetUpdated();
    }

    public void MarkAsCompleted()
    {
        if (Status != OrderStatus.Processing && Status != OrderStatus.Pending)
            throw new DomainException($"Cannot complete order with status {Status}.");

        Status = OrderStatus.Completed;
        SetUpdated();
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Completed)
            throw new DomainException("Completed orders cannot be cancelled directly; issue a refund instead.");

        Status = OrderStatus.Cancelled;
        SetUpdated();
    }

    public void Refund()
    {
        if (Status != OrderStatus.Completed)
            throw new DomainException("Only completed orders can be refunded.");

        Status = OrderStatus.Refunded;
        SetUpdated();
    }

    private void RecalculateTotal()
    {
        TotalAmount = _items.Sum(i => i.TotalPrice);
        SetUpdated();
    }

    private static string GenerateOrderNumber()
    {
        return $"PRD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
    }
}

