using IdleSdk.Core.Compendium;

namespace IdleSdk.Core.Tests.Compendium;

public class CompendiumRegistryTests
{
    [Fact]
    public void BestiaryRegistry_Rejects_Duplicate()
    {
        var registry = new BestiaryRegistry();
        var entry = new BestiaryEntry("wolf", "Wolf", "Predator");

        registry.Register(entry);

        Assert.Throws<InvalidOperationException>(() => registry.Register(entry));
    }

    [Fact]
    public void ItemCompendiumRegistry_Rejects_Duplicate()
    {
        var registry = new ItemCompendiumRegistry();
        var entry = new ItemCompendiumEntry("log", "Log", "Basic wood");

        registry.Register(entry);

        Assert.Throws<InvalidOperationException>(() => registry.Register(entry));
    }
}
