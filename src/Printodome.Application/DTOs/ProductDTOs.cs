using Printodome.Domain.Enums;

namespace Printodome.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string SKU,
    string Description,
    decimal Price,
    int StockQuantity,
    ProductCategory Category,
    string CategoryName,
    string Brand,
    string ImageUrl,
    bool IsActive);

public record ProductFilterRequest(
    string? SearchTerm = null,
    ProductCategory? Category = null,
    string? Brand = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    bool InStockOnly = false,
    string? SortBy = "name",
    bool SortDescending = false,
    int PageNumber = 1,
    int PageSize = 12);

public class PaginatedResult<T>
{
    public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    public PaginatedResult(IReadOnlyList<T> items, int count, int pageNumber, int pageSize)
    {
        Items = items;
        TotalCount = count;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}

public record TopSellingProductDto(
    Guid ProductId,
    string SKU,
    string ProductName,
    string CategoryName,
    int UnitsSold,
    decimal TotalRevenue);

