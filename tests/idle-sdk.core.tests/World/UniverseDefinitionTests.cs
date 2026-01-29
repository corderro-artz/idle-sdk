using IdleSdk.Core.World;

namespace IdleSdk.Core.Tests.World;

public class UniverseDefinitionTests
{
    [Fact]
    public void AddWorld_Rejects_Null()
    {
        var universe = new UniverseDefinition("universe", "Universe");

        Assert.Throws<ArgumentNullException>(() => universe.AddWorld(null!));
    }

    [Fact]
    public void AddWorld_Appends()
    {
        var universe = new UniverseDefinition("universe", "Universe");
        universe.AddWorld(new WorldDefinition("world", "World"));

        Assert.Single(universe.Worlds);
    }
}
