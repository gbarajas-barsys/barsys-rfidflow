using Microsoft.AspNetCore.Mvc;

using RFIDFlow.API.Services.Readers;

namespace RFIDFlow.API.Controllers;

[ApiController]
[Route("api/readers")]
public class ReadersController
    : ControllerBase
{
    private readonly
        ReaderRegistry _registry;

    private readonly
        MultiReaderProvider
        _providerFactory;

    public ReadersController(
        ReaderRegistry registry,
        MultiReaderProvider providerFactory)
    {
        _registry =
            registry;

        _providerFactory =
            providerFactory;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(
            _registry.GetReaders()
        );
    }

    [HttpGet("count")]
    public IActionResult Count()
    {
        return Ok(
            new
            {
                Count =
                    _registry
                        .GetReaderCount()
            }
        );
    }

    [HttpGet("details")]
    public IActionResult Details()
    {
        return Ok(
            new
            {
                Readers =
                    _registry.GetReaders(),

                ConfiguredCount =
                    _registry.GetReaderCount()
            }
        );
    }

    [HttpGet("providers")]
    public IActionResult Providers()
    {
        return Ok(
            new
            {
                Providers =
                    _providerFactory
                        .Providers
                        .Count
            }
        );
    }

    [HttpGet("status")]
    public IActionResult Status()
    {
        return Ok(
            _providerFactory
                .Providers
                .Select(provider =>
                    new
                    {
                        ReaderName =
                            ((ImpinjR700Provider)provider)
                                .ReaderName,

                        ReaderIp =
                            ((ImpinjR700Provider)provider)
                                .ReaderIp,

                        IsConnected =
                            ((ImpinjR700Provider)provider)
                                .IsConnected,

                        LastSeenUtc =
                            ((ImpinjR700Provider)provider)
                                .LastSeenUtc
                    })
        );
    }
}