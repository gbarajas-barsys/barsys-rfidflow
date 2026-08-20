using Barsys.RfidFlow.Api.Infrastructure;
using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Application.Behaviors;
using Barsys.RfidFlow.Application.Common;
using Barsys.RfidFlow.Application.Features.Assets.Commands;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Barsys.RfidFlow.Infrastructure.Repositories;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Barsys.RfidFlow.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRfidFlowServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ITenantContextAccessor, HttpTenantContextAccessor>();

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(CreateAssetCommand).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddValidatorsFromAssembly(typeof(CreateAssetCommand).Assembly);

        var useInMemory = configuration.GetValue<bool>("UseInMemoryRepository");
        if (useInMemory)
        {
            services.AddScoped(typeof(IRepository<>), typeof(InMemoryRepository<>));
        }
        else
{
    services.AddDbContext<RfidFlowDbContext>(options =>
        options.UseNpgsql(
            configuration.GetConnectionString("Postgres"))
        .UseSnakeCaseNamingConvention());

    services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
}

        services.AddAuthentication("Bearer").AddJwtBearer("Bearer", options =>
        {
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters.ValidateAudience = false;
            options.TokenValidationParameters.ValidateIssuer = false;
            options.TokenValidationParameters.ValidateIssuerSigningKey = false;
            options.TokenValidationParameters.ValidateLifetime = false;
        });
        services.AddAuthorization();
        services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
        return services;
    }
}
