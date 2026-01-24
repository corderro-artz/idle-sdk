using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Items;

public class InventoryServiceTests
{
    [Fact]
    public void Inventory_Adds_And_Removes_Items()
    {
        var registry = new ItemRegistry();
        registry.Register(new ItemDefinition("log", "Log", true));

        var service = new InventoryService(registry);
        var profileId = Guid.NewGuid();

        service.AddItem(profileId, "log", 5);
        service.RemoveItem(profileId, "log", 2);

        var inventory = service.GetOrCreate(profileId);
        Assert.Equal(3, inventory.GetQuantity("log"));
    }

    [Fact]
    public void Inventory_Remove_Throws_When_Insufficient()
    {
        var inventory = new Inventory();

        Assert.Throws<InvalidOperationException>(() => inventory.RemoveItem("log", 1));
    }
}
