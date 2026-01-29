using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Items;

public class InventorySlotTests
{
    [Fact]
    public void InventorySlot_Stores_Values()
    {
        var slot = new InventorySlot("log", 5);

        Assert.Equal("log", slot.ItemId);
        Assert.Equal(5, slot.Quantity);
    }
}
