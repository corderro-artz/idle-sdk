using IdleSdk.Core.Theme;

namespace IdleSdk.Core.Tests.Theme;

public class ThemeServiceTests
{
    [Fact]
    public void ThemeService_Applies_Theme()
    {
        var registry = new ThemeRegistry();
        registry.Register(new ThemeDefinition("dark", "Dark", new Dictionary<string, string> { ["bg"] = "#000" }));

        var service = new ThemeService(registry);
        service.ApplyTheme("dark");

        Assert.Equal("dark", service.CurrentThemeId);
    }
}
