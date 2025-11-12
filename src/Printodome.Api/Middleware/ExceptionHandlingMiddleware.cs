using Microsoft.AspNetCore.Mvc;
using Printodome.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace Printodome.Api.Middleware;

/// <summary>
/// Global exception handling middleware that catches all unhandled exceptions,
/// maps domain-specific exceptions to standard HTTP status codes, and outputs RFC 7807 ProblemDetails.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing request {Path}", context.Request.Path);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json";

        var (statusCode, title, detail) = exception switch
        {
            InsufficientStockException stockEx => (
                HttpStatusCode.UnprocessableEntity, // 422 Unprocessable Entity
                "Insufficient Inventory Stock",
                stockEx.Message),

            ConcurrencyConflictException conflictEx => (
                HttpStatusCode.Conflict, // 409 Conflict
                "Inventory Concurrency Conflict",
                conflictEx.Message),

            ProductNotFoundException notFoundEx => (
                HttpStatusCode.NotFound, // 404 Not Found
                "Resource Not Found",
                notFoundEx.Message),

            DomainException domainEx => (
                HttpStatusCode.BadRequest, // 400 Bad Request
                "Business Rule Violation",
                domainEx.Message),

            ArgumentException argEx => (
                HttpStatusCode.BadRequest, // 400 Bad Request
                "Invalid Request Parameter",
                argEx.Message),

            _ => (
                HttpStatusCode.InternalServerError, // 500 Internal Server Error
                "An unexpected server error occurred",
                "An unexpected internal error occurred. Please contact Printodome platform support.")
        };

        context.Response.StatusCode = (int)statusCode;

        var problemDetails = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path,
            Type = $"https://httpstatuses.io/{(int)statusCode}"
        };

        problemDetails.Extensions["timestamp"] = DateTime.UtcNow;
        problemDetails.Extensions["traceId"] = context.TraceIdentifier;

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await context.Response.WriteAsync(json);
    }
}

