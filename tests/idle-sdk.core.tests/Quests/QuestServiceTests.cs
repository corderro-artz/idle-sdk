using IdleSdk.Core.Events;
using IdleSdk.Core.Quests;

namespace IdleSdk.Core.Tests.Quests;

public class QuestServiceTests
{
    [Fact]
    public void Quest_Completes_When_Target_Reached()
    {
        var registry = new QuestRegistry();
        registry.Register(new QuestDefinition("gather", "Gather", "Collect 5", 5));

        var service = new QuestService(registry);
        var profileId = Guid.NewGuid();

        service.AddProgress(profileId, "gather", 5);

        var progress = service.GetOrCreate(profileId, "gather");
        Assert.True(progress.Completed);
    }

    [Fact]
    public void EventedQuestService_Publishes_Progress()
    {
        var registry = new QuestRegistry();
        registry.Register(new QuestDefinition("hunt", "Hunt", "Defeat 2", 2));

        var hub = new EventHub();
        var service = new QuestService(registry);
        var evented = new EventedQuestService(hub, service);

        QuestProgressed? published = null;
        using var subscription = hub.Subscribe<QuestProgressed>(evt => published = evt);

        var profileId = Guid.NewGuid();
        evented.AddProgress(profileId, "hunt", 2);

        Assert.NotNull(published);
        Assert.True(published!.Completed);
    }
}
