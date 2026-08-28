using Microsoft.AspNetCore.Mvc;
using RFIDFlow.API.Services;

namespace RFIDFlow.API.Controllers;

[ApiController]
[Route("api/presence")]
public class PresenceController : ControllerBase
{
    private readonly PresenceService _presence;

    public PresenceController(
        PresenceService presence)
    {
        _presence = presence;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(
            _presence.GetPresence()
        );
    }
}