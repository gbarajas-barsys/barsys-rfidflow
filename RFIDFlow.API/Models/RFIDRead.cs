namespace RFIDFlow.API.Models;

public class RFIDRead
{
    public string EPC { get; set; }
        = string.Empty;

    public DateTime Timestamp { get; set; }

    public string ReaderName { get; set; }
        = string.Empty;

    public string ReaderIp { get; set; }
        = string.Empty;
}
