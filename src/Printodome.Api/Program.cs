using Microsoft.OpenApi.Models;
using Printodome.Api.Middleware;
using Printodome.Application;
using Printodome.Infrastructure;
using Printodome.Infrastructure.Data;
using Printodome.Infrastructure.Data.Seed;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Add presentation and controllers with string enum serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 2. Register Application & Infrastructure Clean Architecture layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 3. Configure CORS policy for frontend client integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// 4. Configure Swagger / OpenAPI documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Printodome Enterprise E-Commerce API",
        Version = "v1",
        Description = "Enterprise RESTful Web API for Computer Printers, Toner Cartridges, and Accessories. Designed with Clean Architecture, EF Core Optimistic Concurrency, and transactional integrity."
    });
});

var app = builder.Build();

// 5. Database initialization and seeding on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PrintodomeDbContext>();
    await PrintodomeDataSeeder.SeedAsync(context);
}

// 6. Global Exception Handling Middleware (RFC 7807 ProblemDetails)
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 7. Swagger Documentation pipeline
if (app.Environment.IsDevelopment() || true) // Enabled for prototype verification
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Printodome API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();

// Exposed for WebApplicationFactory in integration tests if needed
public partial class Program { }
