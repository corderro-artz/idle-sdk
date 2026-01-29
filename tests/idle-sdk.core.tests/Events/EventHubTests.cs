using IdleSdk.Core.Events;

namespace IdleSdk.Core.Tests.Events;

public class EventHubTests
{
    [Fact]
    public void Publish_Continues_When_Handler_Throws()
    {
        var hub = new EventHub();
        var calls = 0;
        Exception? captured = null;
        hub.HandlerException = (ex, _) => captured = ex;

        hub.Subscribe<string>(_ => throw new InvalidOperationException("boom"));
        hub.Subscribe<string>(_ => calls += 1);

        hub.Publish("payload");

        Assert.Equal(1, calls);
        Assert.NotNull(captured);
    }

    [Fact]
    public void Dispose_Unsubscribes_Handler()
    {
        var hub = new EventHub();
        var calls = 0;

        using (hub.Subscribe<int>(_ => calls += 1))
        {
            hub.Publish(1);
        }

        hub.Publish(2);

        Assert.Equal(1, calls);
    }
}
