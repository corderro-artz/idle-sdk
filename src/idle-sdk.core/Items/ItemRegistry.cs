namespace IdleSdk.Core.Items;

public sealed class ItemRegistry
{
    private readonly Dictionary<string, ItemDefinition> _definitions = new(StringComparer.OrdinalIgnoreCase);

    public void Register(ItemDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (_definitions.ContainsKey(definition.Id))
        {
            throw new InvalidOperationException($"Item '{definition.Id}' is already registered.");
        }

        _definitions[definition.Id] = definition;
    }

    public ItemDefinition Get(string itemId)
    {
        if (!_definitions.TryGetValue(itemId, out var definition))
        {
            throw new KeyNotFoundException($"Item '{itemId}' was not found.");
        }

        return definition;
    }

    public IReadOnlyCollection<ItemDefinition> Definitions => _definitions.Values.ToList();
}
