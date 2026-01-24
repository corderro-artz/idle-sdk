using IdleSdk.Core.Combat;

namespace IdleSdk.Core.Tests.Combat;

public class CombatSystemTests
{
    [Fact]
    public void CombatTick_Applies_Damage_And_Logs()
    {
        var combatants = new List<CombatantState>
        {
            new("player", new CombatantStats(10, 5, 1)),
            new("enemy", new CombatantStats(8, 3, 0))
        };

        var encounter = new CombatEncounter(combatants);
        var system = new CombatSystem();

        var result = system.Step(encounter);

        Assert.NotEmpty(result.LogEntries);
        Assert.Equal(2, result.LogEntries.Count);
        Assert.Equal(3, combatants[1].CurrentHealth);
    }

    [Fact]
    public void CombatTick_Stops_When_Only_One_Left()
    {
        var combatants = new List<CombatantState>
        {
            new("player", new CombatantStats(10, 50, 0)),
            new("enemy", new CombatantStats(5, 1, 0))
        };

        var encounter = new CombatEncounter(combatants);
        var system = new CombatSystem();

        var result = system.Step(encounter);

        Assert.Single(result.LogEntries);
        Assert.True(combatants[1].IsDefeated);
    }
}
