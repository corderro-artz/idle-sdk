namespace IdleSdk.Core.Generator;

public sealed class LayeredGenerator
{
    public IReadOnlyDictionary<string, string> Generate(IReadOnlyList<LayerDefinition> layers, int seed)
    {
        if (layers is null)
        {
            throw new ArgumentNullException(nameof(layers));
        }

        var random = new Random(seed);
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var layer in layers)
        {
            if (layer.Weights.Count == 0)
            {
                continue;
            }

            var total = layer.Weights.Values.Sum();
            var roll = random.Next(1, total + 1);
            var cumulative = 0;

            foreach (var entry in layer.Weights)
            {
                cumulative += entry.Value;
                if (roll <= cumulative)
                {
                    result[layer.Id] = entry.Key;
                    break;
                }
            }
        }

        return result;
    }
}
