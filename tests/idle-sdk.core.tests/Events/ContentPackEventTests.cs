using IdleSdk.Core.Events;

namespace IdleSdk.Core.Tests.Events;

public class ContentPackEventTests
{
    [Fact]
    public void ContentPackEvents_Carry_Expected_Values()
    {
        var loaded = new ContentPackLoaded("pack-a", true);
        var enabled = new ContentPackEnabled("pack-a");
        var disabled = new ContentPackDisabled("pack-a");
        var reloaded = new ContentPackHotReloaded("pack-a");
        var failed = new ContentPackHotReloadFailed("root");

        Assert.Equal("pack-a", loaded.PackId);
        Assert.True(loaded.Enabled);
        Assert.Equal("pack-a", enabled.PackId);
        Assert.Equal("pack-a", disabled.PackId);
        Assert.Equal("pack-a", reloaded.PackId);
        Assert.Equal("root", failed.PackRoot);
    }
}
