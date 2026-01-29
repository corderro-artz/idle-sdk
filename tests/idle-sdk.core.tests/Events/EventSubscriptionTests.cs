using IdleSdk.Core.Events;

namespace IdleSdk.Core.Tests.Events;

public class EventSubscriptionTests
{
    [Fact]
    public void Dispose_Is_Idempotent()
    {
        var calls = 0;
        var subscription = new EventSubscription(() => calls++);

        subscription.Dispose();
        subscription.Dispose();

        Assert.Equal(1, calls);
    }

    [Fact]
    public void Constructor_Rejects_Null_Unsubscribe()
    {
        Assert.Throws<ArgumentNullException>(() => new EventSubscription(null!));
    }
}
