using IdleSdk.Core.Scene;

namespace IdleSdk.Core.Tests.Scene;

public class SceneDiffEngineTests
{
    [Fact]
    public void Diff_Finds_Added_And_Removed_Elements()
    {
        var previous = new SceneFrame();
        previous.Add(new SceneElement("a", SceneLayer.Background, "bg", 0, 0));
        previous.Add(new SceneElement("b", SceneLayer.Foreground, "player", 10, 5));

        var current = new SceneFrame();
        current.Add(new SceneElement("b", SceneLayer.Foreground, "player", 10, 5));
        current.Add(new SceneElement("c", SceneLayer.Overlay, "drop", 2, 1));

        var engine = new SceneDiffEngine();
        var diff = engine.Compute(previous, current);

        Assert.Single(diff.Added);
        Assert.Single(diff.Removed);
        Assert.Equal("c", diff.Added[0].Id);
        Assert.Equal("a", diff.Removed[0].Id);
    }
}
