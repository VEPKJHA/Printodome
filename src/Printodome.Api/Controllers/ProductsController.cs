using Microsoft.AspNetCore.Mvc;
using Printodome.Application.DTOs;
using Printodome.Application.Services;
using Printodome.Domain.Enums;

namespace Printodome.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a paginated list of products matching search, category, brand, and price criteria.
    /// Uses deferred IQueryable execution.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResult<ProductDto>>> GetProducts(
        [FromQuery] string? searchTerm = null,
        [FromQuery] ProductCategory? category = null,
        [FromQuery] string? brand = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool inStockOnly = false,
        [FromQuery] string? sortBy = "name",
        [FromQuery] bool sortDescending = false,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken cancellationToken = default)
    {
        var request = new ProductFilterRequest(
            searchTerm,
            category,
            brand,
            minPrice,
            maxPrice,
            inStockOnly,
            sortBy,
            sortDescending,
            pageNumber,
            pageSize);

        var result = await _productService.GetProductsAsync(request, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Fetches detailed product information by unique GUID identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProductById(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productService.GetProductByIdAsync(id, cancellationToken);
        return Ok(product);
    }

    /// <summary>
    /// Fetches product information by stock keeping unit (SKU).
    /// </summary>
    [HttpGet("sku/{sku}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetProductBySku(string sku, CancellationToken cancellationToken = default)
    {
        var product = await _productService.GetProductBySkuAsync(sku, cancellationToken);
        return Ok(product);
    }

    /// <summary>
    /// Retrieves distinct list of brands active in the catalog.
    /// </summary>
    [HttpGet("brands")]
    [ProducesResponseType(typeof(IReadOnlyList<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands(CancellationToken cancellationToken = default)
    {
        var brands = await _productService.GetAvailableBrandsAsync(cancellationToken);
        return Ok(brands);
    }
}

