using IdleSdk.Core.Replay;

namespace IdleSdk.Core.Tests.Replay;

public class DeterministicReplayRunnerTests
{
    [Fact]
    public void Replay_Is_Deterministic()
    {
        var runner = new DeterministicReplayRunner();
        var first = runner.Run(5, tick => $"{tick}-output");
        var second = runner.Run(5, tick => $"{tick}-output");

        Assert.Equal(first, second);
    }

    [Fact]
    public void Run_Rejects_NonPositive_Ticks()
    {
        var runner = new DeterministicReplayRunner();

        Assert.Throws<ArgumentOutOfRangeException>(() => runner.Run(0, _ => "noop"));
    }

    [Fact]
    public void Run_Rejects_Null_Step()
    {
        var runner = new DeterministicReplayRunner();

        Assert.Throws<ArgumentNullException>(() => runner.Run(1, null!));
    }
}
