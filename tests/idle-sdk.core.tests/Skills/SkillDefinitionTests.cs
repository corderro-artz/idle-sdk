using IdleSdk.Core.Skills;

namespace IdleSdk.Core.Tests.Skills;

public class SkillDefinitionTests
{
    [Fact]
    public void SkillDefinition_Stores_Values()
    {
        var unlocks = new Dictionary<int, string> { [2] = "Bronze" };
        var definition = new SkillDefinition("mining", "Mining", "⛏️", 10, unlocks);

        Assert.Equal("mining", definition.Id);
        Assert.Equal("Mining", definition.Name);
        Assert.Equal("⛏️", definition.Icon);
        Assert.Equal(10, definition.MaxLevel);
        Assert.Single(definition.Unlocks);
    }
}
