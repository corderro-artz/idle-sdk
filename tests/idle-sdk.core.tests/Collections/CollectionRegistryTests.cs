using IdleSdk.Core.Collections;

namespace IdleSdk.Core.Tests.Collections;

public class CollectionRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate()
    {
        var registry = new CollectionRegistry();
        var collection = new CollectionDefinition("starter", "Starter", new[] { "log" });

        registry.Register(collection);

        Assert.Throws<InvalidOperationException>(() => registry.Register(collection));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new CollectionRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }
}
