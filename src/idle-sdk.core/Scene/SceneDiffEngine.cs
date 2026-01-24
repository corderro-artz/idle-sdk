namespace IdleSdk.Core.Scene;

public sealed class SceneDiffEngine
{
    public SceneDiff Compute(SceneFrame previous, SceneFrame current)
    {
        if (previous is null)
        {
            throw new ArgumentNullException(nameof(previous));
        }

        if (current is null)
        {
            throw new ArgumentNullException(nameof(current));
        }

        var previousIds = previous.Elements.Select(e => e.Id).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var currentIds = current.Elements.Select(e => e.Id).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var added = current.Elements.Where(e => !previousIds.Contains(e.Id)).ToList();
        var removed = previous.Elements.Where(e => !currentIds.Contains(e.Id)).ToList();

        return new SceneDiff(added, removed);
    }
}
