using IdleSdk.Core.Input;

namespace IdleSdk.Core.Tests.Input;

public class HotkeyManagerTests
{
    [Fact]
    public void HotkeyManager_Rebinds_Action()
    {
        var manager = new HotkeyManager();
        manager.Register(new HotkeyBinding("open-menu", "Ctrl+M"));

        manager.Rebind("open-menu", "Ctrl+Shift+M");

        var binding = manager.Get("open-menu");
        Assert.Equal("Ctrl+Shift+M", binding.KeyCombination);
    }
}
