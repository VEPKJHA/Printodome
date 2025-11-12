using Printodome.Domain.Common;

namespace Printodome.Domain.Entities;

/// <summary>
/// Line item within an order capturing snapshot details at time of purchase.
/// </summary>
public class OrderItem : BaseEntity
{
    public Guid OrderId { get; private set; }
    public Order? Order { get; private set; }

    public Guid ProductId { get; private set; }
    public Product? Product { get; private set; }

    public string ProductName { get; private set; } = string.Empty;
    public string ProductSKU { get; private set; } = string.Empty;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public decimal TotalPrice => UnitPrice * Quantity;

    private OrderItem() { }

    public OrderItem(Guid productId, string productName, string productSku, decimal unitPrice, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be at least 1.", nameof(quantity));
        if (unitPrice < 0)
            throw new ArgumentException("Unit price cannot be negative.", nameof(unitPrice));

        ProductId = productId;
        ProductName = productName;
        ProductSKU = productSku;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }

    internal void AttachOrder(Guid orderId)
    {
        OrderId = orderId;
    }
}

