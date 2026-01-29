using IdleSdk.Core.Theme;

namespace IdleSdk.Core.Tests.Theme;

public class ThemeRegistryTests
{
    [Fact]
    public void Register_Rejects_Duplicate()
    {
        var registry = new ThemeRegistry();
        var theme = new ThemeDefinition("dark", "Dark", new Dictionary<string, string>());

        registry.Register(theme);

        Assert.Throws<InvalidOperationException>(() => registry.Register(theme));
    }

    [Fact]
    public void ApplyTheme_Throws_When_Missing()
    {
        var registry = new ThemeRegistry();
        var service = new ThemeService(registry);

        Assert.Throws<KeyNotFoundException>(() => service.ApplyTheme("missing"));
    }
}
