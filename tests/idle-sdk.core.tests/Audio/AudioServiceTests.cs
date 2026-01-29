using IdleSdk.Core.Audio;

namespace IdleSdk.Core.Tests.Audio;

public class AudioServiceTests
{
    [Fact]
    public void AudioService_Tracks_Current_Music()
    {
        var registry = new AudioRegistry();
        registry.Register(new AudioTrack("theme", "Main Theme"));

        var service = new AudioService(registry);
        service.PlayMusic("theme");

        Assert.Equal("theme", service.CurrentMusicTrackId);
    }

    [Fact]
    public void AudioMixer_Clamps_Volume()
    {
        var mixer = new AudioMixerState();
        mixer.SetMaster(2f);

        Assert.Equal(1f, mixer.MasterVolume);
    }

    [Fact]
    public void AudioMixer_Clamps_All_Channels()
    {
        var mixer = new AudioMixerState();
        mixer.SetMusic(-1f);
        mixer.SetEffects(2f);

        Assert.Equal(0f, mixer.MusicVolume);
        Assert.Equal(1f, mixer.EffectsVolume);
    }
}
