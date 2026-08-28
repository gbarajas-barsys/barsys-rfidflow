using RFIDFlow.API.Models;

namespace RFIDFlow.API.Services.Readers;

public class MultiReaderProvider
{
    private readonly
        List<IRFIDReaderProvider>
        _providers = new();

    public IReadOnlyList<
        IRFIDReaderProvider
    > Providers => _providers;

    public MultiReaderProvider(
        ReaderRegistry registry
    )
    {
        foreach (
            var reader
            in registry.GetReaders()
        )
        {
            _providers.Add(
                new ImpinjR700Provider(
                    reader
                )
            );
        }
    }
}