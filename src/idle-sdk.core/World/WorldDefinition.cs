namespace IdleSdk.Core.World;

public sealed class WorldDefinition
{
    private readonly List<WorldRegion> _regions = new();

    public WorldDefinition(string id, string name)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }

    public string Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<WorldRegion> Regions => _regions.AsReadOnly();

    public void AddRegion(WorldRegion region)
    {
        if (region is null)
        {
            throw new ArgumentNullException(nameof(region));
        }

        _regions.Add(region);
    }
}
