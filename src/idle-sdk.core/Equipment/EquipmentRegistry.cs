namespace IdleSdk.Core.Equipment;

public sealed class EquipmentRegistry
{
    private readonly Dictionary<string, EquipmentItemDefinition> _definitions = new(StringComparer.OrdinalIgnoreCase);

    public void Register(EquipmentItemDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (_definitions.ContainsKey(definition.ItemId))
        {
            throw new InvalidOperationException($"Equipment item '{definition.ItemId}' is already registered.");
        }

        _definitions[definition.ItemId] = definition;
    }

    public EquipmentItemDefinition Get(string itemId)
    {
        if (!_definitions.TryGetValue(itemId, out var definition))
        {
            throw new KeyNotFoundException($"Equipment item '{itemId}' was not found.");
        }

        return definition;
    }
}
