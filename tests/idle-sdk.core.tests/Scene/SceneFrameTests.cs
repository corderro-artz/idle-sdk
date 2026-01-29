using IdleSdk.Core.Scene;

namespace IdleSdk.Core.Tests.Scene;

public class SceneFrameTests
{
    [Fact]
    public void Add_Rejects_Null()
    {
        var frame = new SceneFrame();

        Assert.Throws<ArgumentNullException>(() => frame.Add(null!));
    }

    [Fact]
    public void Add_Appends_Elements()
    {
        var frame = new SceneFrame();
        frame.Add(new SceneElement("bg", SceneLayer.Background, "forest", 0, 0));

        Assert.Single(frame.Elements);
    }
}
