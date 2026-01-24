namespace IdleSdk.Core.Generator;

public sealed record LayerDefinition(string Id, IReadOnlyDictionary<string, int> Weights);
