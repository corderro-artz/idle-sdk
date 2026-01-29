using IdleSdk.Core.Achievements;

namespace IdleSdk.Core.Tests.Achievements;

public class AchievementProgressTests
{
    [Fact]
    public void Constructor_Rejects_Null_Definition()
    {
        Assert.Throws<ArgumentNullException>(() => new AchievementProgress(null!));
    }

    [Fact]
    public void AddProgress_Rejects_NonPositive()
    {
        var progress = new AchievementProgress(new AchievementDefinition("a", "Ach", "Desc", 3));

        Assert.Throws<ArgumentOutOfRangeException>(() => progress.AddProgress(0));
        Assert.Throws<ArgumentOutOfRangeException>(() => progress.AddProgress(-1));
    }

    [Fact]
    public void AddProgress_Ignores_When_Completed()
    {
        var progress = new AchievementProgress(new AchievementDefinition("a", "Ach", "Desc", 2));
        progress.AddProgress(2);

        progress.AddProgress(1);

        Assert.Equal(2, progress.CurrentValue);
        Assert.True(progress.Completed);
    }
}
