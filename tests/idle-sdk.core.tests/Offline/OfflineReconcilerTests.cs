using IdleSdk.Core.Offline;
using IdleSdk.Core.Timing;

namespace IdleSdk.Core.Tests.Offline;

public class OfflineReconcilerTests
{
    [Fact]
    public void Reconcile_Clamps_To_MaxDuration()
    {
        var clock = new SimulationClock(1);
        var scheduler = new TickScheduler(clock);
        var reconciler = new OfflineReconciler(scheduler);

        var request = new OfflineReconcileRequest(Guid.NewGuid(), DateTimeOffset.UtcNow.AddHours(-5), DateTimeOffset.UtcNow);

        var ticks = 0;
        var result = reconciler.Reconcile(request, _ => ticks++, TimeSpan.FromHours(1));

        Assert.Equal(TimeSpan.FromHours(1), result.SimulatedDuration);
        Assert.Equal(3600, ticks);
    }
}
