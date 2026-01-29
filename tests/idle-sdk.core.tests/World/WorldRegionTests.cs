using IdleSdk.Core.World;

namespace IdleSdk.Core.Tests.World;

public class WorldRegionTests
{
    [Fact]
    public void AddZone_Rejects_Null()
    {
        var region = new WorldRegion("region", "Region");

        Assert.Throws<ArgumentNullException>(() => region.AddZone(null!));
    }

    [Fact]
    public void AddZone_Appends()
    {
        var region = new WorldRegion("region", "Region");
        region.AddZone(new WorldZone("zone", "Zone"));

        Assert.Single(region.Zones);
    }
}
