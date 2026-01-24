namespace IdleSdk.Core.Events;

public sealed record QuestProgressed(Guid ProfileId, string QuestId, int Amount, bool Completed);
