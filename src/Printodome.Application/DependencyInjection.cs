using Microsoft.Extensions.DependencyInjection;
using Printodome.Application.Services;

namespace Printodome.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IOrderProcessingService, OrderProcessingService>();
        services.AddScoped<IReportingService, ReportingService>();

        return services;
    }
}

