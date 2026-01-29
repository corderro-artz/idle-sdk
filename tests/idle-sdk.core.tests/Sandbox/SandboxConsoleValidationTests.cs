using IdleSdk.Core.Sandbox;

namespace IdleSdk.Core.Tests.Sandbox;

public class SandboxConsoleValidationTests
{
    [Fact]
    public void Register_Rejects_Invalid_Command()
    {
        var console = new SandboxConsole();

        Assert.Throws<ArgumentException>(() => console.Register(" ", _ => new SandboxResult(true, "ok")));
        Assert.Throws<ArgumentNullException>(() => console.Register("ping", null!));
    }

    [Fact]
    public void Register_Rejects_Duplicate_Command()
    {
        var console = new SandboxConsole();
        console.Register("ping", _ => new SandboxResult(true, "pong"));

        Assert.Throws<InvalidOperationException>(() => console.Register("ping", _ => new SandboxResult(true, "pong")));
    }

    [Fact]
    public void Execute_Returns_Unknown_When_Unregistered()
    {
        var console = new SandboxConsole();
        console.Enable();

        var result = console.Execute(new SandboxCommand("missing", new Dictionary<string, string>()));

        Assert.False(result.Success);
        Assert.Contains("Unknown", result.Message, StringComparison.OrdinalIgnoreCase);
    }
}
