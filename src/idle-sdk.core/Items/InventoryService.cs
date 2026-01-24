namespace IdleSdk.Core.Items;

public sealed class InventoryService
{
    private readonly ItemRegistry _registry;
    private readonly Dictionary<Guid, Inventory> _inventories = new();

    public InventoryService(ItemRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public Inventory GetOrCreate(Guid profileId)
    {
        if (_inventories.TryGetValue(profileId, out var inventory))
        {
            return inventory;
        }

        inventory = new Inventory();
        _inventories[profileId] = inventory;
        return inventory;
    }

    public void AddItem(Guid profileId, string itemId, int quantity)
    {
        _registry.Get(itemId);
        var inventory = GetOrCreate(profileId);
        inventory.AddItem(itemId, quantity);
    }

    public void RemoveItem(Guid profileId, string itemId, int quantity)
    {
        _registry.Get(itemId);
        var inventory = GetOrCreate(profileId);
        inventory.RemoveItem(itemId, quantity);
    }
}
