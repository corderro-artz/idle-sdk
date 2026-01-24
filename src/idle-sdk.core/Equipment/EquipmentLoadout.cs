namespace IdleSdk.Core.Equipment;

public sealed class EquipmentLoadout
{
    private readonly Dictionary<EquipmentSlot, string> _equipped = new();

    public void Equip(EquipmentSlot slot, string itemId)
    {
        if (string.IsNullOrWhiteSpace(itemId))
        {
            throw new ArgumentException("Item id must be provided.", nameof(itemId));
        }

        _equipped[slot] = itemId;
    }

    public void Unequip(EquipmentSlot slot)
    {
        _equipped.Remove(slot);
    }

    public string? GetEquipped(EquipmentSlot slot)
    {
        return _equipped.TryGetValue(slot, out var itemId) ? itemId : null;
    }

    public IReadOnlyDictionary<EquipmentSlot, string> Slots => _equipped;
}
