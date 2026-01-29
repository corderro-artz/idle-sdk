using IdleSdk.Core.Actions;

namespace IdleSdk.Core.Tests.Actions;

public class ActionDefinitionTests
{
    [Fact]
    public void ActionDefinition_Stores_Values()
    {
        var definition = new ActionDefinition("train", "Train", TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(2), new[] { "tag" });

        Assert.Equal("train", definition.Id);
        Assert.Equal("Train", definition.Name);
        Assert.Equal(TimeSpan.FromSeconds(1), definition.Duration);
        Assert.Equal(TimeSpan.FromSeconds(2), definition.Cooldown);
        Assert.Single(definition.Tags);
    }
}
