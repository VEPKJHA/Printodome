using Printodome.Application.Common.Interfaces;
using Printodome.Application.DTOs;
using Printodome.Domain.Entities;
using Printodome.Domain.Enums;
using Printodome.Domain.Exceptions;

namespace Printodome.Application.Services;

public interface IProductService
{
    Task<PaginatedResult<ProductDto>> GetProductsAsync(ProductFilterRequest request, CancellationToken cancellationToken = default);
    Task<ProductDto> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductDto> GetProductBySkuAsync(string sku, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<string>> GetAvailableBrandsAsync(CancellationToken cancellationToken = default);
}

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<PaginatedResult<ProductDto>> GetProductsAsync(
        ProductFilterRequest request,
        CancellationToken cancellationToken = default)
    {
        // Showcase LINQ deferred execution on IQueryable
        var query = _productRepository.GetQueryable().Where(p => p.IsActive);

        // 1. Text Search Filter across Name, SKU, Description, and Brand
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.SKU.ToLower().Contains(term) ||
                p.Brand.ToLower().Contains(term) ||
                p.Description.ToLower().Contains(term));
        }

        // 2. Category Filter
        if (request.Category.HasValue)
        {
            query = query.Where(p => p.Category == request.Category.Value);
        }

        // 3. Brand Filter
        if (!string.IsNullOrWhiteSpace(request.Brand))
        {
            query = query.Where(p => p.Brand == request.Brand);
        }

        // 4. Price Boundary Filters
        if (request.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= request.MaxPrice.Value);
        }

        // 5. In-Stock Only Filter
        if (request.InStockOnly)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        // Total count evaluation before pagination
        var totalCount = query.Count();

        // 6. Dynamic Sorting via LINQ expressions
        query = (request.SortBy?.ToLowerInvariant(), request.SortDescending) switch
        {
            ("price", false) => query.OrderBy(p => p.Price),
            ("price", true) => query.OrderByDescending(p => p.Price),
            ("stock", false) => query.OrderBy(p => p.StockQuantity),
            ("stock", true) => query.OrderByDescending(p => p.StockQuantity),
            ("name", true) => query.OrderByDescending(p => p.Name),
            _ => query.OrderBy(p => p.Name)
        };

        // 7. Pagination with deferred skip & take
        var safePageNumber = Math.Max(1, request.PageNumber);
        var safePageSize = Math.Clamp(request.PageSize, 1, 100);

        var pagedItems = query
            .Skip((safePageNumber - 1) * safePageSize)
            .Take(safePageSize)
            .Select(p => new ProductDto(
                p.Id,
                p.Name,
                p.SKU,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.Category,
                p.Category.ToString(),
                p.Brand,
                p.ImageUrl,
                p.IsActive))
            .ToList();

        return await Task.FromResult(new PaginatedResult<ProductDto>(
            pagedItems,
            totalCount,
            safePageNumber,
            safePageSize));
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
            throw new ProductNotFoundException(id);

        return MapToDto(product);
    }

    public async Task<ProductDto> GetProductBySkuAsync(string sku, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetBySkuAsync(sku, cancellationToken);
        if (product == null)
            throw new DomainException($"Product with SKU '{sku}' not found.");

        return MapToDto(product);
    }

    public async Task<IReadOnlyList<string>> GetAvailableBrandsAsync(CancellationToken cancellationToken = default)
    {
        var brands = _productRepository.GetQueryable()
            .Where(p => p.IsActive)
            .Select(p => p.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToList();

        return await Task.FromResult<IReadOnlyList<string>>(brands);
    }

    private static ProductDto MapToDto(Product p) => new(
        p.Id,
        p.Name,
        p.SKU,
        p.Description,
        p.Price,
        p.StockQuantity,
        p.Category,
        p.Category.ToString(),
        p.Brand,
        p.ImageUrl,
        p.IsActive);
}

