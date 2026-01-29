using IdleSdk.Core.Collections;

namespace IdleSdk.Core.Tests.Collections;

public class CollectionProgressTests
{
    [Fact]
    public void Constructor_Rejects_Null_Definition()
    {
        Assert.Throws<ArgumentNullException>(() => new CollectionProgress(null!));
    }

    [Fact]
    public void AddItem_Rejects_Invalid_Item()
    {
        var progress = new CollectionProgress(new CollectionDefinition("c", "Collection", new[] { "log" }));

        Assert.Throws<ArgumentException>(() => progress.AddItem(" "));
    }

    [Fact]
    public void IsComplete_Tracks_Items()
    {
        var progress = new CollectionProgress(new CollectionDefinition("c", "Collection", new[] { "log", "stone" }));

        Assert.False(progress.IsComplete);
        progress.AddItem("log");
        Assert.False(progress.IsComplete);
        progress.AddItem("stone");
        Assert.True(progress.IsComplete);
    }
}
