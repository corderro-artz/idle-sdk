using IdleSdk.Core.Generator;

namespace IdleSdk.Core.Tests.Generator;

public class LayeredGeneratorTests
{
    [Fact]
    public void Generator_Is_Deterministic_For_Same_Seed()
    {
        var layers = new List<LayerDefinition>
        {
            new("base", new Dictionary<string, int> { ["a"] = 1, ["b"] = 1 }),
            new("hat", new Dictionary<string, int> { ["x"] = 2, ["y"] = 1 })
        };

        var generator = new LayeredGenerator();
        var first = generator.Generate(layers, 42);
        var second = generator.Generate(layers, 42);

        Assert.Equal(first["base"], second["base"]);
        Assert.Equal(first["hat"], second["hat"]);
    }
}
