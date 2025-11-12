using Printodome.Domain.Entities;
using Printodome.Domain.Enums;

namespace Printodome.Application.Common.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default);

    Task<Product?> GetBySkuAsync(string sku, CancellationToken cancellationToken = default);
    Task<Product?> GetBySkuAsync(string sku, bool asNoTracking, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Product>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Product>> GetByIdsAsync(IEnumerable<Guid> ids, bool asNoTracking, CancellationToken cancellationToken = default);

    IQueryable<Product> GetQueryable();
    IQueryable<Product> GetQueryable(bool asNoTracking);

    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    void Update(Product product);
}

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Order?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default);

    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
    Task<Order?> GetByOrderNumberAsync(string orderNumber, bool asNoTracking, CancellationToken cancellationToken = default);

    IQueryable<Order> GetQueryable();
    IQueryable<Order> GetQueryable(bool asNoTracking);

    Task AddAsync(Order order, CancellationToken cancellationToken = default);
    void Update(Order order);
}

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Customer?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default);

    Task<Customer?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Customer?> GetByEmailAsync(string email, bool asNoTracking, CancellationToken cancellationToken = default);

    Task AddAsync(Customer customer, CancellationToken cancellationToken = default);
}

public interface IUnitOfWork
{
    IProductRepository Products { get; }
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }

    Task<int> CommitAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
