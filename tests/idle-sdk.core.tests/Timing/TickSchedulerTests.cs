using IdleSdk.Core;
using IdleSdk.Core.Timing;

namespace IdleSdk.Core.Tests.Timing;

public class TickSchedulerTests
{
    [Fact]
    public void Step_Invokes_TickAction_For_Each_Tick()
    {
        var clock = new SimulationClock(2);
        var scheduler = new TickScheduler(clock);
        var ticks = 0;

        var emitted = scheduler.Step(TimeSpan.FromSeconds(1.1), _ => ticks++);

        Assert.Equal(2, emitted);
        Assert.Equal(2, ticks);
    }

    [Fact]
    public void Step_Emits_TickContexts_With_Expected_Values()
    {
        var clock = new SimulationClock(2);
        var scheduler = new TickScheduler(clock);
        var contexts = new List<TickContext>();

        scheduler.Step(TimeSpan.FromSeconds(1.1), ctx => contexts.Add(ctx));

        Assert.Collection(contexts,
            first =>
            {
                Assert.Equal(1, first.TickIndex);
                Assert.Equal(TimeSpan.FromSeconds(0.5), first.SimulatedTime);
            },
            second =>
            {
                Assert.Equal(2, second.TickIndex);
                Assert.Equal(TimeSpan.FromSeconds(1), second.SimulatedTime);
            });
    }

    [Fact]
    public void Step_Invokes_TickStart_And_TickEnd()
    {
        var clock = new SimulationClock(1);
        var scheduler = new TickScheduler(clock);
        var start = new List<long>();
        var end = new List<long>();

        scheduler.TickStart += (_, ctx) => start.Add(ctx.TickIndex);
        scheduler.TickEnd += (_, ctx) => end.Add(ctx.TickIndex);

        scheduler.Step(TimeSpan.FromSeconds(2.1), _ => { });

        Assert.Equal(new[] { 1L, 2L }, start);
        Assert.Equal(new[] { 1L, 2L }, end);
    }

    [Fact]
    public void Step_Rejects_Null_TickAction()
    {
        var clock = new SimulationClock(1);
        var scheduler = new TickScheduler(clock);

        Assert.Throws<ArgumentNullException>(() => scheduler.Step(TimeSpan.FromSeconds(1), null!));
    }
}
