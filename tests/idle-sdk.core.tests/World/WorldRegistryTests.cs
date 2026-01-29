using IdleSdk.Core.World;

namespace IdleSdk.Core.Tests.World;

public class WorldRegistryTests
{
    [Fact]
    public void Registry_Stores_Universe_Hierarchy()
    {
        var universe = new UniverseDefinition("u1", "Prime");
        var world = new WorldDefinition("w1", "Earth");
        var region = new WorldRegion("r1", "North");
        var zone = new WorldZone("z1", "Forest");
        zone.AddNode(new WorldNode("n1", "Clearing"));
        region.AddZone(zone);
        world.AddRegion(region);
        universe.AddWorld(world);

        var registry = new WorldRegistry();
        registry.RegisterUniverse(universe);

        var stored = registry.GetUniverse("u1");
        Assert.Equal("Prime", stored.Name);
        Assert.Single(stored.Worlds);
    }

    [Fact]
    public void Registry_Rejects_Duplicate_And_Missing()
    {
        var registry = new WorldRegistry();
        var universe = new UniverseDefinition("u1", "Prime");

        registry.RegisterUniverse(universe);

        Assert.Throws<InvalidOperationException>(() => registry.RegisterUniverse(universe));
        Assert.Throws<KeyNotFoundException>(() => registry.GetUniverse("missing"));
    }
}
