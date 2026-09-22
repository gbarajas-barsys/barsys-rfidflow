namespace Barsys.RfidFlow.Application.Abstractions;

public interface IRfidTemplateRenderer
{
    string Render(
        string template,
        Dictionary<string, string> values);
}