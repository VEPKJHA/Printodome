using Printodome.Domain.Enums;

namespace Printodome.Application.DTOs;

public record CustomerRequest(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Address,
    string City,
    string State,
    string PostalCode);

public record CustomerDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Address,
    string City,
    string State,
    string PostalCode);

public record OrderItemRequest(
    Guid ProductId,
    int Quantity);

public record CreateOrderRequest(
    CustomerRequest Customer,
    List<OrderItemRequest> Items,
    string ShippingAddress,
    string BillingAddress,
    string? PaymentReference = null);

public record OrderItemDto(
    Guid ProductId,
    string ProductName,
    string ProductSKU,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice);

public record OrderDto(
    Guid Id,
    string OrderNumber,
    Guid CustomerId,
    CustomerDto? Customer,
    DateTime OrderDateUtc,
    OrderStatus Status,
    string StatusName,
    decimal TotalAmount,
    string ShippingAddress,
    string BillingAddress,
    string? PaymentReference,
    IReadOnlyList<OrderItemDto> Items);

