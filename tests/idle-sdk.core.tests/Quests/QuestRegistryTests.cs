using IdleSdk.Core.Quests;

namespace IdleSdk.Core.Tests.Quests;

public class QuestRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate()
    {
        var registry = new QuestRegistry();
        var quest = new QuestDefinition("gather", "Gather", "Collect", 5);

        registry.Register(quest);

        Assert.Throws<InvalidOperationException>(() => registry.Register(quest));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new QuestRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }
}
