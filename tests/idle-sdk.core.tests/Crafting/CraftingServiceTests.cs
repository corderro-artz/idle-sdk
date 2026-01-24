using IdleSdk.Core.Crafting;
using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Crafting;

public class CraftingServiceTests
{
    [Fact]
    public void Crafting_Consumes_Inputs_And_Produces_Output()
    {
        var itemRegistry = new ItemRegistry();
        itemRegistry.Register(new ItemDefinition("log", "Log", true));
        itemRegistry.Register(new ItemDefinition("plank", "Plank", true));

        var inventoryService = new InventoryService(itemRegistry);
        var profileId = Guid.NewGuid();
        inventoryService.AddItem(profileId, "log", 2);

        var crafting = new CraftingService(inventoryService);
        crafting.Register(new RecipeDefinition("plank", "Plank", new Dictionary<string, int> { ["log"] = 2 }, "plank", 1));

        crafting.Craft(profileId, "plank");

        var inventory = inventoryService.GetOrCreate(profileId);
        Assert.Equal(0, inventory.GetQuantity("log"));
        Assert.Equal(1, inventory.GetQuantity("plank"));
    }
}
