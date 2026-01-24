using IdleSdk.Demo.ViewModels;

namespace IdleSdk.Demo.Tests;

public class DemoViewModelTests
{
    [Fact]
    public void DemoViewModel_Initializes_With_World_Lines()
    {
        var vm = new DemoViewModel();

        Assert.NotEmpty(vm.WorldLines);
        Assert.Contains(vm.WorldLines, line => line.StartsWith("Universe"));
    }

    [Fact]
    public void DemoViewModel_Tick_Updates_Combat_Log()
    {
        var vm = new DemoViewModel();

        vm.TickCommand.Execute(null);

        Assert.NotEmpty(vm.CombatLines);
    }
}
