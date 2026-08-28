namespace RFIDFlow.API.Models;

public class PresenceRecord
{
    public string EPC { get; set; } =
        string.Empty;

    public DateTime LastSeen { get; set; }

    public bool Present { get; set; }
}