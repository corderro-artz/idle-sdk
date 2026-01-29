using IdleSdk.Core.Input;

namespace IdleSdk.Core.Tests.Input;

public class HotkeyManagerValidationTests
{
    [Fact]
    public void Register_Rejects_Null_Binding()
    {
        var manager = new HotkeyManager();

        Assert.Throws<ArgumentNullException>(() => manager.Register(null!));
    }

    [Fact]
    public void Register_Rejects_Duplicate_Action()
    {
        var manager = new HotkeyManager();
        manager.Register(new HotkeyBinding("open-menu", "Ctrl+M"));

        Assert.Throws<InvalidOperationException>(() => manager.Register(new HotkeyBinding("open-menu", "Ctrl+Shift+M")));
    }

    [Fact]
    public void Rebind_Throws_When_Action_Missing()
    {
        var manager = new HotkeyManager();

        Assert.Throws<KeyNotFoundException>(() => manager.Rebind("missing", "Ctrl+K"));
    }

    [Fact]
    public void Get_Throws_When_Action_Missing()
    {
        var manager = new HotkeyManager();

        Assert.Throws<KeyNotFoundException>(() => manager.Get("missing"));
    }
}
