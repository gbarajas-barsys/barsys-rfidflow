using Barsys.RfidFlow.Application.Abstractions;

namespace Barsys.RfidFlow.Infrastructure.Services;

public sealed class RfidTemplateRenderer
    : IRfidTemplateRenderer
{
    public string Render(
        string template,
        Dictionary<string, string> values)
    {
        var result = template;

        foreach (var pair in values)
        {
            result =
                result.Replace(
                    $"{{{{{pair.Key}}}}}",
                    pair.Value ?? string.Empty
                );
        }

        return result;
    }
}