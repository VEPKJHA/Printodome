using Microsoft.AspNetCore.Mvc;
using Printodome.Application.DTOs;
using Printodome.Application.Services;

namespace Printodome.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly IReportingService _reportingService;

    public ReportsController(IReportingService reportingService)
    {
        _reportingService = reportingService;
    }

    /// <summary>
    /// Demonstrates advanced LINQ grouping and sorting to return top-selling printers.
    /// </summary>
    [HttpGet("top-selling-printers")]
    [ProducesResponseType(typeof(IReadOnlyList<TopSellingProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TopSellingProductDto>>> GetTopSellingPrinters(
        [FromQuery] int limit = 5,
        CancellationToken cancellationToken = default)
    {
        var topSelling = await _reportingService.GetTopSellingPrintersAsync(limit, cancellationToken);
        return Ok(topSelling);
    }

    /// <summary>
    /// Generates executive sales report with category breakdowns and performance metrics.
    /// </summary>
    [HttpGet("sales-summary")]
    [ProducesResponseType(typeof(SalesReportDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<SalesReportDto>> GetSalesSummary(
        [FromQuery] DateTime? startDateUtc = null,
        [FromQuery] DateTime? endDateUtc = null,
        CancellationToken cancellationToken = default)
    {
        var summary = await _reportingService.GenerateSalesReportAsync(startDateUtc, endDateUtc, cancellationToken);
        return Ok(summary);
    }
}

