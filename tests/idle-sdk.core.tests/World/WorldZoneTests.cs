using IdleSdk.Core.World;

namespace IdleSdk.Core.Tests.World;

public class WorldZoneTests
{
    [Fact]
    public void AddNode_Rejects_Null()
    {
        var zone = new WorldZone("zone", "Zone");

        Assert.Throws<ArgumentNullException>(() => zone.AddNode(null!));
    }

    [Fact]
    public void AddNode_Appends()
    {
        var zone = new WorldZone("zone", "Zone");
        zone.AddNode(new WorldNode("node", "Node"));

        Assert.Single(zone.Nodes);
    }
}
