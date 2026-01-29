using IdleSdk.Core.Achievements;

namespace IdleSdk.Core.Tests.Achievements;

public class AchievementRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate()
    {
        var registry = new AchievementRegistry();
        var achievement = new AchievementDefinition("kill10", "Slayer", "Defeat 10", 10);

        registry.Register(achievement);

        Assert.Throws<InvalidOperationException>(() => registry.Register(achievement));
    }

    [Fact]
    public void Get_Throws_When_Missing()
    {
        var registry = new AchievementRegistry();

        Assert.Throws<KeyNotFoundException>(() => registry.Get("missing"));
    }
}
