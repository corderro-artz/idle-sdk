using IdleSdk.Core.Equipment;

namespace IdleSdk.Core.Tests.Equipment;

public class EquipmentLoadoutTests
{
    [Fact]
    public void Equip_And_Unequip_Manage_Slots()
    {
        var loadout = new EquipmentLoadout();
        loadout.Equip(EquipmentSlot.Weapon, "sword");

        Assert.Equal("sword", loadout.GetEquipped(EquipmentSlot.Weapon));

        loadout.Unequip(EquipmentSlot.Weapon);

        Assert.Null(loadout.GetEquipped(EquipmentSlot.Weapon));
    }

    [Fact]
    public void Equip_Rejects_Invalid_ItemId()
    {
        var loadout = new EquipmentLoadout();

        Assert.Throws<ArgumentException>(() => loadout.Equip(EquipmentSlot.Weapon, " "));
    }
}
