namespace Printodome.Domain.Enums;

/// <summary>
/// Status lifecycle of a customer order in the e-commerce domain.
/// </summary>
public enum OrderStatus
{
    Pending = 1,
    Processing = 2,
    Completed = 3,
    Cancelled = 4,
    Refunded = 5
}

