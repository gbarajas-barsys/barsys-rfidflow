using Microsoft.AspNetCore.Mvc;

using RFIDFlow.API.Services;

namespace RFIDFlow.API.Controllers;

[ApiController]
[Route("api/reads")]
public class ReadsController
    : ControllerBase
{
    private readonly
        RFIDReadBuffer _buffer;

    public ReadsController(
        RFIDReadBuffer buffer)
    {
        _buffer = buffer;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(
            _buffer.GetReads()
        );
    }
}