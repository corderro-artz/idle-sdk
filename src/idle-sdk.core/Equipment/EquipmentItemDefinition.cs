namespace IdleSdk.Core.Equipment;

public sealed record EquipmentItemDefinition(string ItemId, EquipmentSlot Slot, int AttackBonus, int DefenseBonus);
