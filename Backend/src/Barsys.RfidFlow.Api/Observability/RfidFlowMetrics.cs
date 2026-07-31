using System.Diagnostics.Metrics;

namespace Barsys.RfidFlow.Api.Observability;

public sealed class RfidFlowMetrics
{
    private readonly Counter<long> _rfidReadEventsAccepted;
    private readonly Counter<long> _rfidReadEventsRejected;
    private readonly Histogram<double> _rfidBatchSize;
    private readonly Counter<long> _assetsCreated;
    private readonly Counter<long> _inventoryMovementsCreated;

    public RfidFlowMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create(TelemetryConstants.MeterName);
        _rfidReadEventsAccepted = meter.CreateCounter<long>("rfid_read_events_accepted_total", "events", "Accepted RFID read events.");
        _rfidReadEventsRejected = meter.CreateCounter<long>("rfid_read_events_rejected_total", "events", "Rejected RFID read events.");
        _rfidBatchSize = meter.CreateHistogram<double>("rfid_batch_size", "events", "RFID ingestion batch size.");
        _assetsCreated = meter.CreateCounter<long>("assets_created_total", "assets", "Created assets.");
        _inventoryMovementsCreated = meter.CreateCounter<long>("inventory_movements_created_total", "movements", "Created inventory movements.");
    }

    public void RfidAccepted(long count = 1, string? source = null) => _rfidReadEventsAccepted.Add(count, new KeyValuePair<string, object?>("source", source ?? "api"));
    public void RfidRejected(long count = 1, string? source = null) => _rfidReadEventsRejected.Add(count, new KeyValuePair<string, object?>("source", source ?? "api"));
    public void RfidBatch(int size, string? source = null) => _rfidBatchSize.Record(size, new KeyValuePair<string, object?>("source", source ?? "api"));
    public void AssetCreated() => _assetsCreated.Add(1);
    public void InventoryMovementCreated() => _inventoryMovementsCreated.Add(1);
}
