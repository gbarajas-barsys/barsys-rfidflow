using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Barsys.RfidFlow.Infrastructure.Persistence;
using Barsys.RfidFlow.Application.Dtos;


namespace Barsys.RfidFlow.Api.Controllers;

public sealed class TenantsController : ApiControllerBase
{
    private readonly IRepository<Tenant> _repository;
    private readonly RfidFlowDbContext _db;
    public TenantsController(
        IRepository<Tenant> repository,
        RfidFlowDbContext db)
        {
        _repository = repository;
        _db = db;
        }

    [HttpGet]
public async Task<IActionResult> List(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50,
    CancellationToken ct = default)
{
    return Ok(await _repository.ListAsync(
        TenantId,
        page,
        pageSize,
        ct));
}

    [HttpGet("{id:guid}")] 
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var item = await _repository.GetAsync(TenantId, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateTenantWithAdminRequest request,
        CancellationToken ct)
    {
        var existingTenant =
            _db.Tenants.FirstOrDefault(
                x => x.Code == request.Code
            );

        if (existingTenant is not null)
        {
            return BadRequest(
                "Tenant code already exists."
            );
        }

        var existingUser =
            _db.Users.FirstOrDefault(
                x => x.Email == request.AdminEmail
            );

        if (existingUser is not null)
        {
            return BadRequest(
                "Administrator email already exists."
            );
        }

        var tenant = new Tenant
        {
            Name = request.Name,
            Code = request.Code,
            LegalName = request.LegalName,
            Country =
                request.Country ??
                "MX",

            Timezone =
                request.Timezone ??
                "America/Mexico_City",
            Plan = request.Plan,
            Status = 0
        };

        tenant.TenantId = tenant.Id;

        _db.Tenants.Add(tenant);

        await _db.SaveChangesAsync(ct);

        var adminUser =
            new UserAccount
            {
                TenantId = tenant.Id,

                DisplayName =
                    request.AdminName,

                Email =
                    request.AdminEmail,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        "Password123!"
                    ),

                Status = 0
            };

        _db.Users.Add(adminUser);

        await _db.SaveChangesAsync(ct);

        var companyAdminRole =
            _db.Roles.First(
                x => x.Code == "COMPANY_ADMIN"
            );

        _db.UserRoles.Add(
            new UserRole
            {
                UserId = adminUser.Id,
                RoleId = companyAdminRole.Id
            });

        await _db.SaveChangesAsync(ct);

        return Ok(new
        {
            Tenant = tenant.Name,
            AdminUser = adminUser.Email,
            TemporaryPassword = "Password123!"
        });
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Patch(
        Guid id,
        Tenant patch,
        CancellationToken ct)
    {
        var tenant =
            await _db.Tenants.FindAsync(
                new object[] { id },
                ct
            );

        if (tenant is null)
        {
            return NotFound();
        }

        foreach (var p in typeof(Tenant)
            .GetProperties()
            .Where(
                p =>
                    p.CanWrite &&
                    p.Name != "Id" &&
                    p.Name != "TenantId"
            ))
        {
            var value =
                p.GetValue(patch);

            if (value is not null)
            {
                p.SetValue(
                    tenant,
                    value
                );
            }
        }

        await _db.SaveChangesAsync(ct);

        return Ok(tenant);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken ct)
    {
        var tenant =
            await _db.Tenants.FindAsync(
                new object[] { id },
                ct
            );

        if (tenant is null)
        {
            return NotFound();
        }

        _db.Tenants.Remove(tenant);

        await _db.SaveChangesAsync(ct);

        return NoContent();
    }

    [HttpGet("all")]
    public IActionResult All()
    {
        return Ok(
            _db.Tenants
                .OrderBy(x => x.Name)
                .ToList()
        );
    }
}
