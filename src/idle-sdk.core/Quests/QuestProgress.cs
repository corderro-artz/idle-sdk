namespace IdleSdk.Core.Quests;

public sealed class QuestProgress
{
    public QuestProgress(QuestDefinition definition)
    {
        Definition = definition ?? throw new ArgumentNullException(nameof(definition));
    }

    public QuestDefinition Definition { get; }
    public int CurrentValue { get; private set; }
    public bool Completed { get; private set; }

    public void AddProgress(int amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount), "Progress amount must be positive.");
        }

        if (Completed)
        {
            return;
        }

        CurrentValue = Math.Min(Definition.TargetValue, CurrentValue + amount);
        if (CurrentValue >= Definition.TargetValue)
        {
            Completed = true;
        }
    }
}
