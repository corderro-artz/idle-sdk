using IdleSdk.Core.Quests;

namespace IdleSdk.Core.Events;

public sealed class EventedQuestService
{
    private readonly EventHub _eventHub;
    private readonly QuestService _questService;

    public EventedQuestService(EventHub eventHub, QuestService questService)
    {
        _eventHub = eventHub ?? throw new ArgumentNullException(nameof(eventHub));
        _questService = questService ?? throw new ArgumentNullException(nameof(questService));
    }

    public void AddProgress(Guid profileId, string questId, int amount)
    {
        _questService.AddProgress(profileId, questId, amount);
        var progress = _questService.GetOrCreate(profileId, questId);
        _eventHub.Publish(new QuestProgressed(profileId, questId, amount, progress.Completed));
    }
}
