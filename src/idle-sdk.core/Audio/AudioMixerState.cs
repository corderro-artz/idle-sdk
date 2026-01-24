namespace IdleSdk.Core.Audio;

public sealed class AudioMixerState
{
    public float MasterVolume { get; private set; } = 1f;
    public float MusicVolume { get; private set; } = 1f;
    public float EffectsVolume { get; private set; } = 1f;

    public void SetMaster(float volume) => MasterVolume = Clamp(volume);
    public void SetMusic(float volume) => MusicVolume = Clamp(volume);
    public void SetEffects(float volume) => EffectsVolume = Clamp(volume);

    private static float Clamp(float value) => Math.Clamp(value, 0f, 1f);
}
