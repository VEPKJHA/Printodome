using Printodome.Domain.Common;

namespace Printodome.Domain.Entities;

/// <summary>
/// Domain entity representing a customer or corporate buyer.
/// </summary>
public class Customer : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public string City { get; private set; } = string.Empty;
    public string State { get; private set; } = string.Empty;
    public string PostalCode { get; private set; } = string.Empty;

    private readonly List<Order> _orders = new();
    public IReadOnlyCollection<Order> Orders => _orders.AsReadOnly();

    private Customer() { }

    public Customer(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string address,
        string city,
        string state,
        string postalCode)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email.ToLowerInvariant();
        PhoneNumber = phoneNumber;
        Address = address;
        City = city;
        State = state;
        PostalCode = postalCode;
    }

    public string FullName => $"{FirstName} {LastName}".Trim();
}

