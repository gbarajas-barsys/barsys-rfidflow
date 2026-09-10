using Barsys.RfidFlow.Application.Abstractions;
using Barsys.RfidFlow.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

public sealed class UserRolesController
    : ApiControllerBase
{
    private readonly IRepository<UserRole> _repository;

    public UserRolesController(
        IRepository<UserRole> repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        return Ok(
            await _repository.ListAsync(
                TenantId,
                page,
                pageSize,
                ct));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        UserRole entity,
        CancellationToken ct)
    {
        entity.TenantId = TenantId;

        var created =
            await _repository.AddAsync(
                entity,
                ct);

        return Ok(created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken ct)
    {
        return await _repository.DeleteAsync(
            TenantId,
            id,
            ct)
            ? NoContent()
            : NotFound();
    }
}
