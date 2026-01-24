namespace IdleSdk.Core.Combat;

public sealed class CombatSystem
{
    public CombatTickResult Step(CombatEncounter encounter)
    {
        if (encounter is null)
        {
            throw new ArgumentNullException(nameof(encounter));
        }

        return encounter.Tick();
    }
}
