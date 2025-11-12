using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Printodome.Application.Common.Interfaces;
using Printodome.Infrastructure.Data;
using Printodome.Infrastructure.Repositories;

namespace Printodome.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var provider = configuration.GetValue<string>("DatabaseProvider") ?? "InMemory";
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<PrintodomeDbContext>(options =>
        {
            switch (provider.ToLowerInvariant())
            {
                case "sqlserver":
                    options.UseSqlServer(connectionString, sqlOpts =>
                    {
                        sqlOpts.MigrationsAssembly(typeof(PrintodomeDbContext).Assembly.FullName);
                        sqlOpts.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), errorNumbersToAdd: null);
                    });
                    break;

                case "postgresql":
                case "npgsql":
                    options.UseNpgsql(connectionString, pgOpts =>
                    {
                        pgOpts.MigrationsAssembly(typeof(PrintodomeDbContext).Assembly.FullName);
                        pgOpts.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(10), errorCodesToAdd: null);
                    });
                    break;

                case "inmemory":
                default:
                    options.UseInMemoryDatabase("PrintodomeDb");
                    break;
            }
        });

        // Register repositories & UnitOfWork
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}

