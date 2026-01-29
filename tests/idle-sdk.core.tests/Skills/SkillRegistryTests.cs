using IdleSdk.Core.Skills;

namespace IdleSdk.Core.Tests.Skills;

public class SkillRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate()
    {
        var registry = new SkillRegistry();
        var definition = new SkillDefinition("mining", "Mining", "⛏️", 10, new Dictionary<int, string>());

        registry.Register(definition);

        Assert.Throws<InvalidOperationException>(() => registry.Register(definition));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new SkillRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }

    [Fact]
    public void Register_Rejects_Null_Definition()
    {
        var registry = new SkillRegistry();

        Assert.Throws<ArgumentNullException>(() => registry.Register(null!));
    }
}
