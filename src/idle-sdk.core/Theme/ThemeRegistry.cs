namespace IdleSdk.Core.Theme;

public sealed class ThemeRegistry
{
    private readonly Dictionary<string, ThemeDefinition> _definitions = new(StringComparer.OrdinalIgnoreCase);

    public void Register(ThemeDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (_definitions.ContainsKey(definition.Id))
        {
            throw new InvalidOperationException($"Theme '{definition.Id}' is already registered.");
        }

        _definitions[definition.Id] = definition;
    }

    public ThemeDefinition Get(string themeId)
    {
        if (!_definitions.TryGetValue(themeId, out var definition))
        {
            throw new KeyNotFoundException($"Theme '{themeId}' was not found.");
        }

        return definition;
    }
}
