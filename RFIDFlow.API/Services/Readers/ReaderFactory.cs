using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services.Readers;

public class ReaderFactory
{
    public ReaderConfiguration?
        GetPrimaryReader(
            ReaderRegistry registry)
    {
        return registry
            .GetReaders()
            .FirstOrDefault();
    }

    public List<ReaderConfiguration>
        GetAllReaders(
            ReaderRegistry registry)
    {
        return registry
            .GetReaders();
    }
}