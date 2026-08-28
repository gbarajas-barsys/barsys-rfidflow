namespace RFIDFlow.API.Models;

public class ReaderConfiguration
{
    public string Name { get; set; }
        = string.Empty;

    public string IpAddress { get; set; }
        = string.Empty;

    public int Port { get; set; }
}