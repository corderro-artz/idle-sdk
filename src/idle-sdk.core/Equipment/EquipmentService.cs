namespace IdleSdk.Core.Equipment;

public sealed class EquipmentService
{
    private readonly EquipmentRegistry _registry;
    private readonly Dictionary<Guid, EquipmentLoadout> _loadouts = new();

    public EquipmentService(EquipmentRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public EquipmentLoadout GetOrCreateLoadout(Guid profileId)
    {
        if (_loadouts.TryGetValue(profileId, out var loadout))
        {
            return loadout;
        }

        loadout = new EquipmentLoadout();
        _loadouts[profileId] = loadout;
        return loadout;
    }

    public void Equip(Guid profileId, string itemId)
    {
        var definition = _registry.Get(itemId);
        var loadout = GetOrCreateLoadout(profileId);
        loadout.Equip(definition.Slot, itemId);
    }

    public void Unequip(Guid profileId, EquipmentSlot slot)
    {
        var loadout = GetOrCreateLoadout(profileId);
        loadout.Unequip(slot);
    }

    public (int Attack, int Defense) GetTotalBonuses(Guid profileId)
    {
        var loadout = GetOrCreateLoadout(profileId);
        var attack = 0;
        var defense = 0;

        foreach (var itemId in loadout.Slots.Values)
        {
            var definition = _registry.Get(itemId);
            attack += definition.AttackBonus;
            defense += definition.DefenseBonus;
        }

        return (attack, defense);
    }
}
