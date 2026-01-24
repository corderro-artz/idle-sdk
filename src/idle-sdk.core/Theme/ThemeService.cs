namespace IdleSdk.Core.Theme;

public sealed class ThemeService
{
    private readonly ThemeRegistry _registry;

    public ThemeService(ThemeRegistry registry)
    {
        _registry = registry ?? throw new ArgumentNullException(nameof(registry));
    }

    public string? CurrentThemeId { get; private set; }

    public void ApplyTheme(string themeId)
    {
        _registry.Get(themeId);
        CurrentThemeId = themeId;
    }
}
