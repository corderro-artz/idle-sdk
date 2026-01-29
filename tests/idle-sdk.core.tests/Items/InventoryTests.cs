using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Items;

public class InventoryTests
{
    [Fact]
    public void AddItem_Rejects_NonPositive()
    {
        var inventory = new Inventory();

        Assert.Throws<ArgumentOutOfRangeException>(() => inventory.AddItem("log", 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => inventory.AddItem("log", -1));
    }

    [Fact]
    public void RemoveItem_Rejects_NonPositive()
    {
        var inventory = new Inventory();

        Assert.Throws<ArgumentOutOfRangeException>(() => inventory.RemoveItem("log", 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => inventory.RemoveItem("log", -1));
    }

    [Fact]
    public void RemoveItem_Removes_Slot_When_Zero()
    {
        var inventory = new Inventory();
        inventory.AddItem("log", 2);

        inventory.RemoveItem("log", 2);

        Assert.Empty(inventory.GetSlots());
    }
}
