namespace IdleSdk.Core.Audio;

public sealed class AudioService
{
    private readonly AudioRegistry _registry;

    public AudioService(AudioRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public AudioMixerState Mixer { get; } = new();

    public string? CurrentMusicTrackId { get; private set; }

    public void PlayMusic(string trackId)
    {
        _registry.Get(trackId);
        CurrentMusicTrackId = trackId;
    }
}
