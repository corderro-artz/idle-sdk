namespace IdleSdk.Core.Quests;

public sealed class QuestService
{
    private readonly QuestRegistry _registry;
    private readonly Dictionary<Guid, Dictionary<string, QuestProgress>> _progress = new();

    public QuestService(QuestRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public QuestProgress GetOrCreate(Guid profileId, string questId)
    {
        if (!_progress.TryGetValue(profileId, out var profileQuests))
        {
            profileQuests = new Dictionary<string, QuestProgress>(StringComparer.OrdinalIgnoreCase);
            _progress[profileId] = profileQuests;
        }

        if (profileQuests.TryGetValue(questId, out var progress))
        {
            return progress;
        }

        var definition = _registry.Get(questId);
        progress = new QuestProgress(definition);
        profileQuests[questId] = progress;
        return progress;
    }

    public void AddProgress(Guid profileId, string questId, int amount)
    {
        var progress = GetOrCreate(profileId, questId);
        progress.AddProgress(amount);
    }
}
