using IdleSdk.Core.Scene;

namespace IdleSdk.Core.Tests.Scene;

public class SceneDiffEngineValidationTests
{
    [Fact]
    public void Compute_Rejects_Null_Frames()
    {
        var engine = new SceneDiffEngine();
        var frame = new SceneFrame();

        Assert.Throws<ArgumentNullException>(() => engine.Compute(null!, frame));
        Assert.Throws<ArgumentNullException>(() => engine.Compute(frame, null!));
    }
}
