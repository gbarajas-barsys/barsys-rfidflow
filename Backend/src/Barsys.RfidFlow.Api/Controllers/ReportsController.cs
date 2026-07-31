using Microsoft.AspNetCore.Mvc;

namespace Barsys.RfidFlow.Api.Controllers;

[Route("v2/reports")]
public sealed class ReportsController : ApiControllerBase
{
    [HttpGet("inventory-summary")]
    public IActionResult InventorySummary() => Ok(new { generatedAt = DateTimeOffset.UtcNow, totalItems = 0, totalQuantityOnHand = 0, totalQuantityAvailable = 0, lowStockItems = 0 });

    [HttpGet("rfid-read-quality")]
    public IActionResult RfidReadQuality() => Ok(new { generatedAt = DateTimeOffset.UtcNow, totalReads = 0, uniqueTags = 0, duplicateRate = 0, averageRssi = 0 });
}
