namespace IdleSdk.Core.Crafting;

public sealed record RecipeDefinition(string Id, string Name, IReadOnlyDictionary<string, int> Inputs, string OutputItemId, int OutputQuantity);
