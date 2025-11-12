using Microsoft.EntityFrameworkCore;
using Printodome.Application.Common.Interfaces;
using Printodome.Domain.Entities;
using Printodome.Infrastructure.Data;

namespace Printodome.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly PrintodomeDbContext _context;

    public OrderRepository(PrintodomeDbContext context)
    {
        _context = context;
    }

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return GetByIdAsync(id, asNoTracking: true, cancellationToken);
    }

    public async Task<Order?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Orders.AsNoTracking() : _context.Orders;
        return await query
            .Include(o => o.Items)
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default)
    {
        return GetByOrderNumberAsync(orderNumber, asNoTracking: true, cancellationToken);
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Orders.AsNoTracking() : _context.Orders;
        return await query
            .Include(o => o.Items)
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber, cancellationToken);
    }

    public IQueryable<Order> GetQueryable()
    {
        return GetQueryable(asNoTracking: true);
    }

    public IQueryable<Order> GetQueryable(bool asNoTracking)
    {
        var query = asNoTracking ? _context.Orders.AsNoTracking() : _context.Orders;
        return query
            .Include(o => o.Items)
            .AsQueryable();
    }

    public async Task AddAsync(Order order, CancellationToken cancellationToken = default)
    {
        await _context.Orders.AddAsync(order, cancellationToken);
    }

    public void Update(Order order)
    {
        _context.Orders.Update(order);
    }
}

public class CustomerRepository : ICustomerRepository
{
    private readonly PrintodomeDbContext _context;

    public CustomerRepository(PrintodomeDbContext context)
    {
        _context = context;
    }

    public Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return GetByIdAsync(id, asNoTracking: true, cancellationToken);
    }

    public async Task<Customer?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Customers.AsNoTracking() : _context.Customers;
        return await query.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return GetByEmailAsync(email, asNoTracking: false, cancellationToken);
    }

    public async Task<Customer?> GetByEmailAsync(string email, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Customers.AsNoTracking() : _context.Customers;
        return await query.FirstOrDefaultAsync(c => c.Email == email.ToLowerInvariant(), cancellationToken);
    }

    public async Task AddAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        await _context.Customers.AddAsync(customer, cancellationToken);
    }
}
