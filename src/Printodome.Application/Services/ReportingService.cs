using Printodome.Application.Common.Interfaces;
using Printodome.Application.DTOs;
using Printodome.Domain.Enums;

namespace Printodome.Application.Services;

public interface IReportingService
{
    Task<IReadOnlyList<TopSellingProductDto>> GetTopSellingPrintersAsync(int limit = 5, CancellationToken cancellationToken = default);
    Task<SalesReportDto> GenerateSalesReportAsync(DateTime? startDateUtc = null, DateTime? endDateUtc = null, CancellationToken cancellationToken = default);
}

public class ReportingService : IReportingService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public ReportingService(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    /// <summary>
    /// Demonstrates advanced LINQ:
    /// - Deferred execution using IQueryable
    /// - Filtering (Where) for Completed/Processing orders
    /// - Flattening line items (SelectMany)
    /// - Join with Product entity to verify Category (Printers)
    /// - Grouping (GroupBy) by Product
    /// - Aggregations (Sum, Count)
    /// - Ordering (OrderByDescending) and Projection (Select)
    /// </summary>
    public async Task<IReadOnlyList<TopSellingProductDto>> GetTopSellingPrintersAsync(
        int limit = 5,
        CancellationToken cancellationToken = default)
    {
        var ordersQuery = _orderRepository.GetQueryable()
            .Where(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Processing);

        var productsQuery = _productRepository.GetQueryable();

        // LINQ query expression showcasing Join, Where, GroupBy, and Projection
        var topSellingQuery = from order in ordersQuery
                              from item in order.Items
                              join product in productsQuery on item.ProductId equals product.Id
                              where product.Category == ProductCategory.Printers
                              group new { item, product } by new
                              {
                                  product.Id,
                                  product.SKU,
                                  product.Name,
                                  product.Category
                              } into g
                              orderby g.Sum(x => x.item.Quantity) descending
                              select new TopSellingProductDto(
                                  g.Key.Id,
                                  g.Key.SKU,
                                  g.Key.Name,
                                  g.Key.Category.ToString(),
                                  g.Sum(x => x.item.Quantity),
                                  g.Sum(x => x.item.TotalPrice));

        var results = topSellingQuery.Take(limit).ToList();
        return await Task.FromResult<IReadOnlyList<TopSellingProductDto>>(results);
    }

    /// <summary>
    /// Comprehensive sales performance report utilizing LINQ aggregations and category breakdowns.
    /// </summary>
    public async Task<SalesReportDto> GenerateSalesReportAsync(
        DateTime? startDateUtc = null,
        DateTime? endDateUtc = null,
        CancellationToken cancellationToken = default)
    {
        var query = _orderRepository.GetQueryable()
            .Where(o => o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Refunded);

        if (startDateUtc.HasValue)
            query = query.Where(o => o.OrderDateUtc >= startDateUtc.Value);

        if (endDateUtc.HasValue)
            query = query.Where(o => o.OrderDateUtc <= endDateUtc.Value);

        var ordersList = query.ToList();

        var totalOrders = ordersList.Count;
        var totalRevenue = ordersList.Sum(o => o.TotalAmount);
        var totalItemsSold = ordersList.SelectMany(o => o.Items).Sum(i => i.Quantity);
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0m;

        // Group by product category via product join
        var allProducts = _productRepository.GetQueryable().ToDictionary(p => p.Id);

        var categoryBreakdown = ordersList
            .SelectMany(o => o.Items)
            .GroupBy(i => allProducts.TryGetValue(i.ProductId, out var prod) ? prod.Category.ToString() : "Other")
            .Select(g =>
            {
                var catRevenue = g.Sum(x => x.TotalPrice);
                var pct = totalRevenue > 0 ? Math.Round((catRevenue / totalRevenue) * 100, 2) : 0;
                return new CategorySalesSummaryDto(
                    g.Key,
                    g.Sum(x => x.Quantity),
                    catRevenue,
                    pct);
            })
            .OrderByDescending(c => c.TotalRevenue)
            .ToList();

        // Top 5 overall selling items
        var topSelling = ordersList
            .SelectMany(o => o.Items)
            .GroupBy(i => new { i.ProductId, i.ProductName, i.ProductSKU })
            .Select(g => new TopSellingProductDto(
                g.Key.ProductId,
                g.Key.ProductSKU,
                g.Key.ProductName,
                allProducts.TryGetValue(g.Key.ProductId, out var p) ? p.Category.ToString() : "N/A",
                g.Sum(x => x.Quantity),
                g.Sum(x => x.TotalPrice)))
            .OrderByDescending(x => x.UnitsSold)
            .Take(5)
            .ToList();

        return await Task.FromResult(new SalesReportDto(
            totalRevenue,
            totalOrders,
            totalItemsSold,
            averageOrderValue,
            categoryBreakdown,
            topSelling));
    }
}

