using IdleSdk.Core.Events;
using IdleSdk.Core.Modules;

namespace IdleSdk.Core.Tests.Modules;

public class ModuleContextTests
{
    [Fact]
    public void Constructor_Rejects_Null_EventHub()
    {
        Assert.Throws<ArgumentNullException>(() => new ModuleContext(null!));
    }

    [Fact]
    public void Constructor_Sets_EventHub()
    {
        var hub = new EventHub();
        var context = new ModuleContext(hub);

        Assert.Same(hub, context.Events);
    }
}
