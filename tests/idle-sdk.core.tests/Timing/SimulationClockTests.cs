using IdleSdk.Core;

namespace IdleSdk.Core.Tests.Timing;

public class SimulationClockTests
{
    [Fact]
    public void Constructor_Rejects_NonPositive_TickRate()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new SimulationClock(0));
        Assert.Throws<ArgumentOutOfRangeException>(() => new SimulationClock(-1));
    }

    [Fact]
    public void Advance_Accumulates_And_Returns_Ticks()
    {
        var clock = new SimulationClock(2);

        var ticks1 = clock.Advance(TimeSpan.FromMilliseconds(400));
        var ticks2 = clock.Advance(TimeSpan.FromMilliseconds(200));
        var ticks3 = clock.Advance(TimeSpan.FromMilliseconds(600));

        Assert.Equal(0, ticks1);
        Assert.Equal(1, ticks2);
        Assert.Equal(1, ticks3);
        Assert.Equal(2, clock.TotalTicks);
        Assert.Equal(TimeSpan.FromSeconds(1), clock.TotalSimulatedTime);
    }

    [Fact]
    public void Advance_Rejects_Negative_Delta()
    {
        var clock = new SimulationClock(1);

        Assert.Throws<ArgumentOutOfRangeException>(() => clock.Advance(TimeSpan.FromSeconds(-1)));
    }

    [Fact]
    public void Reset_Clears_Accumulated_State()
    {
        var clock = new SimulationClock(2);
        clock.Advance(TimeSpan.FromSeconds(1));

        clock.Reset();

        Assert.Equal(0, clock.TotalTicks);
        Assert.Equal(TimeSpan.Zero, clock.TotalSimulatedTime);
    }
}
