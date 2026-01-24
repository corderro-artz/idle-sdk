using IdleSdk.Core.Compendium;

namespace IdleSdk.Core.Tests.Compendium;

public class CompendiumTests
{
    [Fact]
    public void Compendium_Registers_Entries()
    {
        var bestiary = new BestiaryRegistry();
        bestiary.Register(new BestiaryEntry("wolf", "Wolf", "A forest predator"));

        var items = new ItemCompendiumRegistry();
        items.Register(new ItemCompendiumEntry("log", "Log", "Basic wood"));

        Assert.Single(bestiary.Entries);
        Assert.Single(items.Entries);
    }
}
