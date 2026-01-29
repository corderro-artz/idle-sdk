using IdleSdk.Core.Equipment;

namespace IdleSdk.Core.Tests.Equipment;

public class EquipmentRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate_And_Null()
    {
        var registry = new EquipmentRegistry();
        var item = new EquipmentItemDefinition("sword", EquipmentSlot.Weapon, 3, 0);

        registry.Register(item);

        Assert.Throws<InvalidOperationException>(() => registry.Register(item));
        Assert.Throws<ArgumentNullException>(() => registry.Register(null!));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new EquipmentRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }
}
