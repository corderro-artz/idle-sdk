namespace IdleSdk.Core.World;

public sealed class WorldRegistry
{
    private readonly Dictionary<string, UniverseDefinition> _universes = new(StringComparer.OrdinalIgnoreCase);

    public void RegisterUniverse(UniverseDefinition universe)
    {
        if (universe is null)
        {
            throw new ArgumentNullException(nameof(universe));
        }

        if (_universes.ContainsKey(universe.Id))
        {
            throw new InvalidOperationException($"Universe '{universe.Id}' is already registered.");
        }

        _universes[universe.Id] = universe;
    }

    public UniverseDefinition GetUniverse(string universeId)
    {
        if (!_universes.TryGetValue(universeId, out var universe))
        {
            throw new KeyNotFoundException($"Universe '{universeId}' was not found.");
        }

        return universe;
    }

    public IReadOnlyCollection<UniverseDefinition> Universes => _universes.Values.ToList();
}
