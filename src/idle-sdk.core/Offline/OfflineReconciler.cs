using IdleSdk.Core.Timing;

namespace IdleSdk.Core.Offline;

public sealed class OfflineReconciler
{
    private readonly TickScheduler _scheduler;

    public OfflineReconciler(TickScheduler scheduler)
    {
        _scheduler = scheduler ?? throw new ArgumentNullException(nameof(scheduler));
    }

    public OfflineReconcileResult Reconcile(OfflineReconcileRequest request, Action<TickContext> tickAction, TimeSpan maxDuration)
    {
        if (tickAction is null)
        {
            throw new ArgumentNullException(nameof(tickAction));
        }

        var delta = request.Now - request.LastActiveAt;
        if (delta < TimeSpan.Zero)
        {
            throw new ArgumentOutOfRangeException(nameof(request), "Offline duration must be non-negative.");
        }

        var clamped = delta > maxDuration ? maxDuration : delta;
        var ticks = _scheduler.Step(clamped, tickAction);
        return new OfflineReconcileResult(clamped, ticks);
    }
}
