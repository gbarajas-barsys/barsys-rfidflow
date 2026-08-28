using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services;

public class PresenceService
{
    private readonly Dictionary<
        string,
        PresenceRecord
    > _presence = new();

    public void RegisterRead(
        string epc)
    {
        _presence[epc] =
            new PresenceRecord
            {
                EPC = epc,
                LastSeen =
                    DateTime.UtcNow,
                Present = true
            };
    }

    public List<PresenceRecord>
        GetPresence()
    {
        foreach (
            var record in
            _presence.Values
        )
        {
            record.Present = true;
        }

        return _presence
            .Values
            .ToList();
    }
}