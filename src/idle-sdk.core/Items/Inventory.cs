namespace IdleSdk.Core.Items;

public sealed class Inventory
{
    private readonly Dictionary<string, int> _items = new(StringComparer.OrdinalIgnoreCase);

    public void AddItem(string itemId, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");
        }

        _items[itemId] = GetQuantity(itemId) + quantity;
    }

    public void RemoveItem(string itemId, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");
        }

        var current = GetQuantity(itemId);
        if (current < quantity)
        {
            throw new InvalidOperationException($"Insufficient quantity for '{itemId}'.");
        }

        var remaining = current - quantity;
        if (remaining == 0)
        {
            _items.Remove(itemId);
        }
        else
        {
            _items[itemId] = remaining;
        }
    }

    public int GetQuantity(string itemId)
    {
        return _items.TryGetValue(itemId, out var quantity) ? quantity : 0;
    }

    public IReadOnlyCollection<InventorySlot> GetSlots()
    {
        return _items.Select(pair => new InventorySlot(pair.Key, pair.Value)).ToList();
    }
}
