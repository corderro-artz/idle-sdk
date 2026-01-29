using IdleSdk.Core.Crafting;
using IdleSdk.Core.Items;

namespace IdleSdk.Core.Tests.Crafting;

public class CraftingServiceValidationTests
{
    [Fact]
    public void Register_Rejects_Duplicate_Recipe()
    {
        var registry = new ItemRegistry();
        var inventory = new InventoryService(registry);
        var service = new CraftingService(inventory);
        var recipe = new RecipeDefinition("plank", "Plank", new Dictionary<string, int>(), "plank", 1);

        service.Register(recipe);

        Assert.Throws<InvalidOperationException>(() => service.Register(recipe));
    }

    [Fact]
    public void Craft_Throws_When_Recipe_Missing()
    {
        var registry = new ItemRegistry();
        var inventory = new InventoryService(registry);
        var service = new CraftingService(inventory);

        Assert.Throws<KeyNotFoundException>(() => service.Craft(Guid.NewGuid(), "missing"));
    }
}
