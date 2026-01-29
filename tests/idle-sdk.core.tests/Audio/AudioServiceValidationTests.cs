using IdleSdk.Core.Audio;

namespace IdleSdk.Core.Tests.Audio;

public class AudioServiceValidationTests
{
    [Fact]
    public void PlayMusic_Throws_When_Track_Missing()
    {
        var registry = new AudioRegistry();
        var service = new AudioService(registry);

        Assert.Throws<KeyNotFoundException>(() => service.PlayMusic("missing"));
    }

    [Fact]
    public void AudioRegistry_Rejects_Duplicate()
    {
        var registry = new AudioRegistry();
        var track = new AudioTrack("theme", "Theme");

        registry.Register(track);

        Assert.Throws<InvalidOperationException>(() => registry.Register(track));
    }
}
