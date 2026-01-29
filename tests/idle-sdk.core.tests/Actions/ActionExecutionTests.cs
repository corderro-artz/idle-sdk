using IdleSdk.Core.Actions;

namespace IdleSdk.Core.Tests.Actions;

public class ActionExecutionTests
{
    [Fact]
    public void CanExecute_Rejects_Null_Definition()
    {
        var execution = new ActionExecution();

        Assert.Throws<ArgumentNullException>(() => execution.CanExecute(null!, DateTimeOffset.UtcNow));
    }

    [Fact]
    public void CanExecute_Allows_When_No_Cooldown()
    {
        var execution = new ActionExecution();
        var definition = new ActionDefinition("idle", "Idle", TimeSpan.FromSeconds(1), TimeSpan.Zero, Array.Empty<string>());

        Assert.True(execution.CanExecute(definition, DateTimeOffset.UtcNow));
    }

    [Fact]
    public void CanExecute_Respects_Cooldown()
    {
        var execution = new ActionExecution();
        var definition = new ActionDefinition("test", "Test", TimeSpan.FromSeconds(1), TimeSpan.FromSeconds(5), Array.Empty<string>());
        var start = DateTimeOffset.UtcNow;

        execution.MarkCompleted(start);

        Assert.False(execution.CanExecute(definition, start.AddSeconds(1)));
        Assert.True(execution.CanExecute(definition, start.AddSeconds(6)));
    }

    [Fact]
    public void Restore_Rejects_Null_State()
    {
        var execution = new ActionExecution();

        Assert.Throws<ArgumentNullException>(() => execution.Restore(null!));
    }
}
