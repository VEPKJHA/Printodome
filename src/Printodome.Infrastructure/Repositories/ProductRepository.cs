using Microsoft.EntityFrameworkCore;
using Printodome.Application.Common.Interfaces;
using Printodome.Domain.Entities;
using Printodome.Infrastructure.Data;

namespace Printodome.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly PrintodomeDbContext _context;

    public ProductRepository(PrintodomeDbContext context)
    {
        _context = context;
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // By default, read-only queries use AsNoTracking() for optimal performance and zero memory overhead
        return GetByIdAsync(id, asNoTracking: true, cancellationToken);
    }

    public async Task<Product?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Products.AsNoTracking() : _context.Products;
        return await query.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public Task<Product?> GetBySkuAsync(string sku, CancellationToken cancellationToken = default)
    {
        return GetBySkuAsync(sku, asNoTracking: true, cancellationToken);
    }

    public async Task<Product?> GetBySkuAsync(string sku, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var query = asNoTracking ? _context.Products.AsNoTracking() : _context.Products;
        return await query.FirstOrDefaultAsync(p => p.SKU == sku.ToUpperInvariant(), cancellationToken);
    }

    public Task<IReadOnlyList<Product>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        // In order processing, inventory updates are mutated on these entities, so default is tracked
        return GetByIdsAsync(ids, asNoTracking: false, cancellationToken);
    }

    public async Task<IReadOnlyList<Product>> GetByIdsAsync(IEnumerable<Guid> ids, bool asNoTracking, CancellationToken cancellationToken = default)
    {
        var idList = ids.ToList();
        var query = asNoTracking ? _context.Products.AsNoTracking() : _context.Products;
        return await query
            .Where(p => idList.Contains(p.Id))
            .ToListAsync(cancellationToken);
    }

    public IQueryable<Product> GetQueryable()
    {
        return GetQueryable(asNoTracking: true);
    }

    public IQueryable<Product> GetQueryable(bool asNoTracking)
    {
        return asNoTracking ? _context.Products.AsNoTracking().AsQueryable() : _context.Products.AsQueryable();
    }

    public async Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        await _context.Products.AddAsync(product, cancellationToken);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }
}
