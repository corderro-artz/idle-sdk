namespace IdleSdk.Core.Scene;

public sealed class SceneFrame
{
    private readonly List<SceneElement> _elements = new();

    public IReadOnlyCollection<SceneElement> Elements => _elements.AsReadOnly();

    public void Add(SceneElement element)
    {
        if (element is null)
        {
            throw new ArgumentNullException(nameof(element));
        }

        _elements.Add(element);
    }
}
