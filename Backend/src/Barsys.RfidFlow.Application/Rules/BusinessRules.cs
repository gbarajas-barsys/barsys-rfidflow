namespace Barsys.RfidFlow.Application.Rules;

public static class BusinessRules
{
    public static bool IsValidEpc(string epc) => !string.IsNullOrWhiteSpace(epc) && epc.Length <= 128;
    public static bool QuantityIsPositive(decimal quantity) => quantity > 0;
    public static bool DateRangeIsValid(DateTimeOffset? from, DateTimeOffset? to) => from is null || to is null || from <= to;
}
