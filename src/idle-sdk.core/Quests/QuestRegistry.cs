namespace IdleSdk.Core.Quests;

public sealed class QuestRegistry
{
    private readonly Dictionary<string, QuestDefinition> _definitions = new(StringComparer.OrdinalIgnoreCase);

    public void Register(QuestDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (_definitions.ContainsKey(definition.Id))
        {
            throw new InvalidOperationException($"Quest '{definition.Id}' is already registered.");
        }

        _definitions[definition.Id] = definition;
    }

    public QuestDefinition Get(string questId)
    {
        if (!_definitions.TryGetValue(questId, out var definition))
        {
            throw new KeyNotFoundException($"Quest '{questId}' was not found.");
        }

        return definition;
    }
}
