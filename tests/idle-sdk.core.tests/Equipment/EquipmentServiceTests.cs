using IdleSdk.Core.Equipment;

namespace IdleSdk.Core.Tests.Equipment;

public class EquipmentServiceTests
{
    [Fact]
    public void Equip_Assigns_Item_To_Slot()
    {
        var registry = new EquipmentRegistry();
        registry.Register(new EquipmentItemDefinition("sword", EquipmentSlot.Weapon, 3, 0));

        var service = new EquipmentService(registry);
        var profileId = Guid.NewGuid();

        service.Equip(profileId, "sword");

        var loadout = service.GetOrCreateLoadout(profileId);
        Assert.Equal("sword", loadout.GetEquipped(EquipmentSlot.Weapon));
    }

    [Fact]
    public void Loadout_Computes_Total_Bonuses()
    {
        var registry = new EquipmentRegistry();
        registry.Register(new EquipmentItemDefinition("sword", EquipmentSlot.Weapon, 3, 0));
        registry.Register(new EquipmentItemDefinition("shield", EquipmentSlot.Offhand, 0, 4));

        var service = new EquipmentService(registry);
        var profileId = Guid.NewGuid();

        service.Equip(profileId, "sword");
        service.Equip(profileId, "shield");

        var totals = service.GetTotalBonuses(profileId);
        Assert.Equal(3, totals.Attack);
        Assert.Equal(4, totals.Defense);
    }
}
