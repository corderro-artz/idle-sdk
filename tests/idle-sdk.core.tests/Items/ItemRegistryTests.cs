using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Items;

public class ItemRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate_Item()
    {
        var registry = new ItemRegistry();
        var definition = new ItemDefinition("log", "Log", true);

        registry.Register(definition);

        Assert.Throws<InvalidOperationException>(() => registry.Register(definition));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new ItemRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }

    [Fact]
    public void Register_Rejects_Null_Definition()
    {
        var registry = new ItemRegistry();

        Assert.Throws<ArgumentNullException>(() => registry.Register(null!));
    }
}
