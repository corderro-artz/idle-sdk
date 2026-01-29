using IdleSdk.Core.Modules;

namespace IdleSdk.Core.Tests.Modules;

public class ModuleExceptionTests
{
    [Fact]
    public void ModuleExceptions_Carry_Message()
    {
        var registration = new ModuleRegistrationException("reg");
        var dependency = new ModuleDependencyException("dep");
        var version = new ModuleVersionException("ver");

        Assert.Equal("reg", registration.Message);
        Assert.Equal("dep", dependency.Message);
        Assert.Equal("ver", version.Message);
    }
}
