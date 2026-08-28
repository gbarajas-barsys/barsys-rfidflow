using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services;

public class RFIDReadBuffer
{
    private readonly List<RFIDRead>
        _reads = [];

    public void Add(
        RFIDRead read)
    {
        _reads.Add(read);

        if (
            _reads.Count > 500
        )
        {
            _reads.RemoveAt(0);
        }
    }

    public List<RFIDRead>
        GetReads()
    {
        return _reads
            .OrderByDescending(
                x => x.Timestamp
            )
            .Take(100)
            .ToList();
    }

    public List<RFIDRead>
        DequeueReads()
    {
        var reads =
            _reads.ToList();

        _reads.Clear();

        return reads;
    }
}