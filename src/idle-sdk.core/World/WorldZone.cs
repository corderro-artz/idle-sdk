namespace IdleSdk.Core.World;

public sealed class WorldZone
{
    private readonly List<WorldNode> _nodes = new();

    public WorldZone(string id, string name)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Name = name ?? throw new ArgumentNullException(nameof(name));
    }

    public string Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<WorldNode> Nodes => _nodes.AsReadOnly();

    public void AddNode(WorldNode node)
    {
        if (node is null)
        {
            throw new ArgumentNullException(nameof(node));
        }

        _nodes.Add(node);
    }
}
