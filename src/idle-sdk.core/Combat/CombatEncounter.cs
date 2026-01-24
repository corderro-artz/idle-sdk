namespace IdleSdk.Core.Combat;

public sealed class CombatEncounter
{
    private readonly List<CombatantState> _combatants;

    public CombatEncounter(IEnumerable<CombatantState> combatants)
    {
        _combatants = combatants?.ToList() ?? throw new ArgumentNullException(nameof(combatants));
        if (_combatants.Count < 2)
        {
            throw new ArgumentException("At least two combatants are required.", nameof(combatants));
        }
    }

    public IReadOnlyList<CombatantState> Combatants => _combatants;

    public CombatTickResult Tick()
    {
        var logs = new List<CombatLogEntry>();
        for (var i = 0; i < _combatants.Count; i++)
        {
            var attacker = _combatants[i];
            if (attacker.IsDefeated)
            {
                continue;
            }

            var target = _combatants.FirstOrDefault(c => !c.IsDefeated && c != attacker);
            if (target is null)
            {
                break;
            }

            var damage = Math.Max(0, attacker.Stats.AttackPower - target.Stats.Defense);
            target.ApplyDamage(damage);
            logs.Add(new CombatLogEntry(attacker.Id, target.Id, damage, target.IsDefeated));
        }

        return new CombatTickResult(logs);
    }
}
