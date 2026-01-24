namespace IdleSdk.Core.Combat;

public sealed record CombatLogEntry(string AttackerId, string DefenderId, int Damage, bool DefenderDefeated);
