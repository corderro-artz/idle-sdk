namespace IdleSdk.Core.World;

public sealed class WorldRegion
{
    private readonly List<WorldZone> _zones = new();

    public WorldRegion(string id, string name)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }

    public string Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<WorldZone> Zones => _zones.AsReadOnly();

    public void AddZone(WorldZone zone)
    {
        if (zone is null)
        {
            throw new ArgumentNullException(nameof(zone));
        }

        _zones.Add(zone);
    }
}
