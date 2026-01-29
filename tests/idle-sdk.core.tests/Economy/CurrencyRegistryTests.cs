using IdleSdk.Core.Economy;

namespace IdleSdk.Core.Tests.Economy;

public class CurrencyRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate_Currency()
    {
        var registry = new CurrencyRegistry();
        var definition = new CurrencyDefinition("gold", "Gold", false);

        registry.Register(definition);

        Assert.Throws<InvalidOperationException>(() => registry.Register(definition));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new CurrencyRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }

    [Fact]
    public void Register_Rejects_Null_Definition()
    {
        var registry = new CurrencyRegistry();

        Assert.Throws<ArgumentNullException>(() => registry.Register(null!));
    }
}
