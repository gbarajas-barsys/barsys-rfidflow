using Microsoft.Extensions.Options;

using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services.Readers;

public class ReaderRegistry
{
    private readonly
        RFIDOptions _options;

    public ReaderRegistry(
        IOptions<RFIDOptions> options)
    {
        _options =
            options.Value;
    }

    public List<ReaderConfiguration>
        GetReaders()
    {
        return _options.Readers;
    }

    public ReaderConfiguration?
        GetReader(
            string name)
    {
        return _options.Readers
            .FirstOrDefault(
                x => x.Name == name
            );
    }

    public int GetReaderCount()
    {
        return _options.Readers.Count;
    }
}