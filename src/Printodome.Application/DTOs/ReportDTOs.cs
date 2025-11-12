namespace Printodome.Application.DTOs;

public record CategorySalesSummaryDto(
    string CategoryName,
    int ItemsSold,
    decimal TotalRevenue,
    decimal PercentageOfTotal);

public record SalesReportDto(
    decimal TotalRevenue,
    int TotalOrders,
    int TotalItemsSold,
    decimal AverageOrderValue,
    IReadOnlyList<CategorySalesSummaryDto> CategoryBreakdown,
    IReadOnlyList<TopSellingProductDto> TopSellingProducts);

