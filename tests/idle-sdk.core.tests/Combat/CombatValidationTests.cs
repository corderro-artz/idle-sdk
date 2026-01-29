using IdleSdk.Core.Combat;

namespace IdleSdk.Core.Tests.Combat;

public class CombatValidationTests
{
    [Fact]
    public void CombatSystem_Rejects_Null_Encounter()
    {
        var system = new CombatSystem();

        Assert.Throws<ArgumentNullException>(() => system.Step(null!));
    }

    [Fact]
    public void CombatEncounter_Rejects_Invalid_Combatants()
    {
        Assert.Throws<ArgumentNullException>(() => new CombatEncounter(null!));
        Assert.Throws<ArgumentException>(() => new CombatEncounter(new List<CombatantState> { new("solo", new CombatantStats(10, 1, 0)) }));
    }

    [Fact]
    public void CombatEncounter_Rejects_Invalid_Rules()
    {
        var combatants = new List<CombatantState>
        {
            new("player", new CombatantStats(10, 5, 1)),
            new("enemy", new CombatantStats(8, 3, 0))
        };

        Assert.Throws<ArgumentOutOfRangeException>(() => new CombatEncounter(combatants, null, new CombatRules(-1, 5, 0, 0, EffectStackingMode.Additive)));
        Assert.Throws<ArgumentOutOfRangeException>(() => new CombatEncounter(combatants, null, new CombatRules(5, 2, 0, 0, EffectStackingMode.Additive)));
    }

    [Fact]
    public void CombatantState_Rejects_Negative_Damage()
    {
        var combatant = new CombatantState("player", new CombatantStats(10, 5, 1));

        Assert.Throws<ArgumentOutOfRangeException>(() => combatant.ApplyDamage(-1));
    }

    [Fact]
    public void CombatantEffects_Rejects_Null_Inputs()
    {
        var effects = new CombatantEffects();

        Assert.Throws<ArgumentNullException>(() => effects.Add(null!));
        Assert.Throws<ArgumentNullException>(() => effects.RestoreSnapshot(null!));
    }

    [Fact]
    public void CombatantEffects_Tick_Removes_Expired_And_Decrements()
    {
        var effects = new CombatantEffects();
        effects.Add(new StatusEffect("short", 1, 1, 0));
        effects.Add(new StatusEffect("long", 3, 0, 1));

        effects.Tick();

        Assert.Single(effects.Effects);
        var remaining = effects.Effects.First();
        Assert.Equal("long", remaining.Id);
        Assert.Equal(2, remaining.DurationTicks);
    }

    [Fact]
    public void SimpleCombatAi_Throws_When_No_Targets()
    {
        var ai = new SimpleCombatAi();
        var attacker = new CombatantState("solo", new CombatantStats(10, 5, 1));
        var combatants = new List<CombatantState> { attacker };

        Assert.Throws<InvalidOperationException>(() => ai.SelectTarget(attacker, combatants));
    }

    [Fact]
    public void CombatTick_Emits_Decision_Seed_When_Provided()
    {
        var combatants = new List<CombatantState>
        {
            new("player", new CombatantStats(10, 5, 1)),
            new("enemy", new CombatantStats(8, 3, 0))
        };

        var encounter = new CombatEncounter(combatants, new SimpleCombatAi(), decisionSeed: 42);
        var system = new CombatSystem();

        var result = system.Step(encounter);

        Assert.Equal(2, result.AiDecisions.Count);
        Assert.All(result.AiDecisions, decision => Assert.Equal(42, decision.Seed));
    }
}
