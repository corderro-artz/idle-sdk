using IdleSdk.Core.Offline;
using IdleSdk.Core.Timing;

namespace IdleSdk.Core.Tests.Offline;

public class OfflineReconcilerValidationTests
{
    [Fact]
    public void Reconcile_Rejects_Null_TickAction()
    {
        var clock = new SimulationClock(1);
        var scheduler = new TickScheduler(clock);
        var reconciler = new OfflineReconciler(scheduler);
        var request = new OfflineReconcileRequest(Guid.NewGuid(), DateTimeOffset.UtcNow.AddMinutes(-1), DateTimeOffset.UtcNow);

        Assert.Throws<ArgumentNullException>(() => reconciler.Reconcile(request, null!, TimeSpan.FromMinutes(1)));
    }

    [Fact]
    public void Reconcile_Rejects_Negative_Offline_Duration()
    {
        var clock = new SimulationClock(1);
        var scheduler = new TickScheduler(clock);
        var reconciler = new OfflineReconciler(scheduler);
        var request = new OfflineReconcileRequest(Guid.NewGuid(), DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddMinutes(-1));

        Assert.Throws<ArgumentOutOfRangeException>(() => reconciler.Reconcile(request, _ => { }, TimeSpan.FromMinutes(1)));
    }
}
