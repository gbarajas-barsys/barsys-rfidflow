namespace RFIDFlow.API.Models;

public class RFIDOptions
{
    public List<ReaderConfiguration>
        Readers { get; set; }
            = new();
}