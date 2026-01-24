namespace IdleSdk.Core.Scene;

public sealed class SceneDiff
{
    public SceneDiff(IReadOnlyList<SceneElement> added, IReadOnlyList<SceneElement> removed)
    {
        Added = added;
        Removed = removed;
    }

    public IReadOnlyList<SceneElement> Added { get; }
    public IReadOnlyList<SceneElement> Removed { get; }
}
