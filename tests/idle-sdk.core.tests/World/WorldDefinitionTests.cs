using IdleSdk.Core.World;

namespace IdleSdk.Core.Tests.World;

public class WorldDefinitionTests
{
    [Fact]
    public void AddRegion_Rejects_Null()
    {
        var world = new WorldDefinition("world", "World");

        Assert.Throws<ArgumentNullException>(() => world.AddRegion(null!));
    }

    [Fact]
    public void AddRegion_Appends()
    {
        var world = new WorldDefinition("world", "World");
        world.AddRegion(new WorldRegion("region", "Region"));

        Assert.Single(world.Regions);
    }
}
