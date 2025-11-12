using Printodome.Domain.Common;
using Printodome.Domain.Enums;
using Printodome.Domain.Exceptions;

namespace Printodome.Domain.Entities;

/// <summary>
/// Core product entity representing printers, toner cartridges, and accessories.
/// Incorporates optimistic concurrency tokens to prevent race conditions during high-concurrency checkout.
/// </summary>
public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string SKU { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public ProductCategory Category { get; private set; }
    public string Brand { get; private set; } = string.Empty;
    public string ImageUrl { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    /// <summary>
    /// Concurrency token for optimistic concurrency control during high-traffic checkout.
    /// EF Core monitors this token to detect conflicting updates.
    /// </summary>
    public byte[] RowVersion { get; private set; } = Array.Empty<byte>();

    // Parameterless constructor for EF Core
    private Product() { }

    public Product(
        string name,
        string sku,
        string description,
        decimal price,
        int stockQuantity,
        ProductCategory category,
        string brand,
        string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Product name cannot be empty.", nameof(name));
        if (string.IsNullOrWhiteSpace(sku))
            throw new ArgumentException("SKU cannot be empty.", nameof(sku));
        if (price < 0)
            throw new ArgumentException("Price cannot be negative.", nameof(price));
        if (stockQuantity < 0)
            throw new ArgumentException("Initial stock quantity cannot be negative.", nameof(stockQuantity));

        Name = name;
        SKU = sku.ToUpperInvariant();
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        Category = category;
        Brand = brand;
        ImageUrl = imageUrl;
        IsActive = true;
    }

    /// <summary>
    /// Atomically deducts inventory stock. Throws InsufficientStockException if unavailable.
    /// </summary>
    public void DeductStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Deduction quantity must be greater than zero.", nameof(quantity));

        if (StockQuantity < quantity)
            throw new InsufficientStockException(Id, SKU, quantity, StockQuantity);

        StockQuantity -= quantity;
        SetUpdated();
    }

    /// <summary>
    /// Replenishes inventory stock.
    /// </summary>
    public void Restock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Restock quantity must be greater than zero.", nameof(quantity));

        StockQuantity += quantity;
        SetUpdated();
    }

    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice < 0)
            throw new ArgumentException("Price cannot be negative.", nameof(newPrice));

        Price = newPrice;
        SetUpdated();
    }

    public void SetActiveStatus(bool isActive)
    {
        IsActive = isActive;
        SetUpdated();
    }
}

