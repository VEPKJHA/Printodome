namespace Printodome.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
    public DomainException(string message, Exception innerException) : base(message, innerException) { }
}

public class InsufficientStockException : DomainException
{
    public Guid ProductId { get; }
    public string SKU { get; }
    public int RequestedQuantity { get; }
    public int AvailableStock { get; }

    public InsufficientStockException(Guid productId, string sku, int requestedQuantity, int availableStock)
        : base($"Insufficient stock for product SKU '{sku}' (ID: {productId}). Requested: {requestedQuantity}, Available: {availableStock}.")
    {
        ProductId = productId;
        SKU = sku;
        RequestedQuantity = requestedQuantity;
        AvailableStock = availableStock;
    }
}

public class ProductNotFoundException : DomainException
{
    public Guid ProductId { get; }

    public ProductNotFoundException(Guid productId)
        : base($"Product with identifier '{productId}' was not found in the catalog.")
    {
        ProductId = productId;
    }
}

public class ConcurrencyConflictException : DomainException
{
    public ConcurrencyConflictException(string message) : base(message) { }
    public ConcurrencyConflictException(string message, Exception innerException) : base(message, innerException) { }
}

