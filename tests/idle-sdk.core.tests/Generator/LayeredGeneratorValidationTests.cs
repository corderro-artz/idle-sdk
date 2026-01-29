using IdleSdk.Core.Generator;

namespace IdleSdk.Core.Tests.Generator;

public class LayeredGeneratorValidationTests
{
    [Fact]
    public void Generate_Rejects_Null_Layers()
    {
        var generator = new LayeredGenerator();

        Assert.Throws<ArgumentNullException>(() => generator.Generate(null!, 1));
    }

    [Fact]
    public void Generate_Ignores_Empty_Weights()
    {
        var generator = new LayeredGenerator();
        var layers = new List<LayerDefinition>
        {
            new("layer", new Dictionary<string, int>())
        };

        var result = generator.Generate(layers, 1);

        Assert.Empty(result);
    }
}
