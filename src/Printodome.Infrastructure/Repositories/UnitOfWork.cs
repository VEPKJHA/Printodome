using Microsoft.EntityFrameworkCore;
using Printodome.Application.Common.Interfaces;
using Printodome.Domain.Exceptions;
using Printodome.Infrastructure.Data;

namespace Printodome.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly PrintodomeDbContext _context;

    public IProductRepository Products { get; }
    public IOrderRepository Orders { get; }
    public ICustomerRepository Customers { get; }

    public UnitOfWork(
        PrintodomeDbContext context,
        IProductRepository productRepository,
        IOrderRepository orderRepository,
        ICustomerRepository customerRepository)
    {
        _context = context;
        Products = productRepository;
        Orders = orderRepository;
        Customers = customerRepository;
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Detect optimistic concurrency conflict on RowVersion token
            var failedEntry = ex.Entries.FirstOrDefault();
            var entityName = failedEntry?.Entity.GetType().Name ?? "Entity";

            throw new ConcurrencyConflictException(
                $"Optimistic concurrency conflict occurred on {entityName}. The inventory or record was modified by another transaction while your order was processing. Please reload and retry.",
                ex);
        }
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.CommitTransactionAsync(cancellationToken);
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.RollbackTransactionAsync(cancellationToken);
    }
}

