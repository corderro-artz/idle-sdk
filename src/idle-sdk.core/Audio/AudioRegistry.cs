namespace IdleSdk.Core.Audio;

public sealed class AudioRegistry
{
    private readonly Dictionary<string, IAudioTrack> _tracks = new(StringComparer.OrdinalIgnoreCase);

    public void Register(IAudioTrack track)
    {
        if (track is null)
        {
            throw new ArgumentNullException(nameof(track));
        }

        if (_tracks.ContainsKey(track.Id))
        {
            throw new InvalidOperationException($"Audio track '{track.Id}' is already registered.");
        }

        _tracks[track.Id] = track;
    }

    public IAudioTrack Get(string trackId)
    {
        if (!_tracks.TryGetValue(trackId, out var track))
        {
            throw new KeyNotFoundException($"Audio track '{trackId}' was not found.");
        }

        return track;
    }

    public IReadOnlyCollection<IAudioTrack> Tracks => _tracks.Values.ToList();
}
