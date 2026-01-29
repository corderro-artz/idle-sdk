using IdleSdk.Core.Audio;

namespace IdleSdk.Core.Tests.Audio;

public class AudioRegistryTests
{
    [Fact]
    public void Register_Rejects_Null_Track()
    {
        var registry = new AudioRegistry();

        Assert.Throws<ArgumentNullException>(() => registry.Register(null!));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new AudioRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }
}
