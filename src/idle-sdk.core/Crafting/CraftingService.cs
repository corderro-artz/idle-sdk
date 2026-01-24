using IdleSdk.Core.Items;

namespace IdleSdk.Core.Crafting;

public sealed class CraftingService
{
    private readonly Dictionary<string, RecipeDefinition> _recipes = new(StringComparer.OrdinalIgnoreCase);
    private readonly InventoryService _inventoryService;

    public CraftingService(InventoryService inventoryService)
    {
        _inventoryService = inventoryService ?? throw new ArgumentNullException(nameof(inventoryService));
    }

    public void Register(RecipeDefinition recipe)
    {
        if (recipe is null)
        {
            throw new ArgumentNullException(nameof(recipe));
        }

        if (_recipes.ContainsKey(recipe.Id))
        {
            throw new InvalidOperationException($"Recipe '{recipe.Id}' is already registered.");
        }

        _recipes[recipe.Id] = recipe;
    }

    public RecipeDefinition Get(string recipeId)
    {
        if (!_recipes.TryGetValue(recipeId, out var recipe))
        {
            throw new KeyNotFoundException($"Recipe '{recipeId}' was not found.");
        }

        return recipe;
    }

    public void Craft(Guid profileId, string recipeId)
    {
        var recipe = Get(recipeId);
        var inventory = _inventoryService.GetOrCreate(profileId);

        foreach (var input in recipe.Inputs)
        {
            if (inventory.GetQuantity(input.Key) < input.Value)
            {
                throw new InvalidOperationException($"Missing input '{input.Key}'.");
            }
        }

        foreach (var input in recipe.Inputs)
        {
            _inventoryService.RemoveItem(profileId, input.Key, input.Value);
        }

        _inventoryService.AddItem(profileId, recipe.OutputItemId, recipe.OutputQuantity);
    }
}
