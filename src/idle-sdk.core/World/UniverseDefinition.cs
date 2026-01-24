namespace IdleSdk.Core.World;

public sealed class UniverseDefinition
{
    private readonly List<WorldDefinition> _worlds = new();

    public UniverseDefinition(string id, string name)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }

    public string Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<WorldDefinition> Worlds => _worlds.AsReadOnly();

    public void AddWorld(WorldDefinition world)
    {
        if (world is null)
        {
            throw new ArgumentNullException(nameof(world));
        }

        _worlds.Add(world);
    }
}
