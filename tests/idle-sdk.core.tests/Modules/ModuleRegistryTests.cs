using IdleSdk.Core.Modules;

namespace IdleSdk.Core.Tests.Modules;

public class ModuleRegistryTests
{
    [Fact]
    public void Register_Rejects_Empty_Name()
    {
        var registry = new ModuleRegistry();
        var module = new TestModule("");

        var ex = Assert.Throws<ModuleRegistrationException>(() => registry.Register(module));
        Assert.Contains("name", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ResolveLoadOrder_Rejects_Invalid_Dependency_Name()
    {
        var registry = new ModuleRegistry();
        var module = new TestModule("alpha", new ModuleDependency(" ", new Version(1, 0, 0)));
        registry.Register(module);

        Assert.Throws<ModuleDependencyException>(() => registry.ResolveLoadOrder());
    }

    [Fact]
    public void ResolveLoadOrder_Throws_On_Missing_Dependency()
    {
        var registry = new ModuleRegistry();
        registry.Register(new TestModule("alpha", new ModuleDependency("beta", new Version(1, 0, 0))));

        Assert.Throws<ModuleDependencyException>(() => registry.ResolveLoadOrder());
    }

    [Fact]
    public void RegisterRange_Rejects_Null_List()
    {
        var registry = new ModuleRegistry();

        Assert.Throws<ArgumentNullException>(() => registry.RegisterRange(null!));
    }

    private sealed class TestModule : IModule
    {
        public TestModule(string name, params ModuleDependency[] dependencies)
        {
            Name = name;
            Dependencies = dependencies;
        }

        public string Name { get; }
        public Version Version { get; } = new(1, 0, 0);
        public IReadOnlyCollection<ModuleDependency> Dependencies { get; }

        public void Initialize(ModuleContext context)
        {
        }
    }
}
