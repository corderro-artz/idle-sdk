namespace IdleSdk.Core.Theme;

public sealed record ThemeDefinition(string Id, string Name, IReadOnlyDictionary<string, string> Tokens);
