namespace RFIDFlow.API.Models;

public class ReaderStatus
{
    public string Name { get; set; }
        = string.Empty;

    public string IpAddress { get; set; }
        = string.Empty;

    public bool IsConnected { get; set; }

    public DateTime? LastSeenUtc { get; set; }
}