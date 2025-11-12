using Microsoft.AspNetCore.Mvc;
using Printodome.Application.DTOs;
using Printodome.Application.Services;

namespace Printodome.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly IOrderProcessingService _orderProcessingService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        IOrderProcessingService orderProcessingService,
        ILogger<OrdersController> logger)
    {
        _orderProcessingService = orderProcessingService;
        _logger = logger;
    }

    /// <summary>
    /// Places a new customer order with inventory verification, optimistic concurrency validation,
    /// and atomic database transaction boundary.
    /// </summary>
    /// <param name="request">Order creation request containing customer information and line items.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Created order details with 201 Created status.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<OrderDto>> PlaceOrder(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request == null)
            return BadRequest(new ProblemDetails { Title = "Invalid payload", Detail = "Order request cannot be null." });

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _logger.LogInformation("Processing order placement for customer {Email} with {ItemCount} items.",
            request.Customer?.Email, request.Items?.Count ?? 0);

        var order = await _orderProcessingService.PlaceOrderAsync(request, cancellationToken);

        _logger.LogInformation("Successfully placed order {OrderNumber} with total {Total:C}",
            order.OrderNumber, order.TotalAmount);

        return CreatedAtAction(
            nameof(GetOrderById),
            new { id = order.Id },
            order);
    }

    /// <summary>
    /// Fetches order details by order GUID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetOrderById(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderProcessingService.GetOrderByIdAsync(id, cancellationToken);
        return Ok(order);
    }

    /// <summary>
    /// Fetches order details by human-readable order number (e.g. PRD-20261029-XXXXXX).
    /// </summary>
    [HttpGet("number/{orderNumber}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber, CancellationToken cancellationToken = default)
    {
        var order = await _orderProcessingService.GetOrderByOrderNumberAsync(orderNumber, cancellationToken);
        return Ok(order);
    }
}

