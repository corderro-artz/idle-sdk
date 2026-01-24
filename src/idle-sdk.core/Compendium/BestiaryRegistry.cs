namespace IdleSdk.Core.Compendium;

public sealed class BestiaryRegistry
{
    private readonly Dictionary<string, BestiaryEntry> _entries = new(StringComparer.OrdinalIgnoreCase);

    public void Register(BestiaryEntry entry)
    {
        if (entry is null)
        {
            throw new ArgumentNullException(nameof(entry));
        }

        if (_entries.ContainsKey(entry.Id))
        {
            throw new InvalidOperationException($"Bestiary entry '{entry.Id}' is already registered.");
        }

        _entries[entry.Id] = entry;
    }

    public IReadOnlyCollection<BestiaryEntry> Entries => _entries.Values.ToList();
}
