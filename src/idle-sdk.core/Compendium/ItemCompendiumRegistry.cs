namespace IdleSdk.Core.Compendium;

public sealed class ItemCompendiumRegistry
{
    private readonly Dictionary<string, ItemCompendiumEntry> _entries = new(StringComparer.OrdinalIgnoreCase);

    public void Register(ItemCompendiumEntry entry)
    {
        if (entry is null)
        {
            throw new ArgumentNullException(nameof(entry));
        }

        if (_entries.ContainsKey(entry.Id))
        {
            throw new InvalidOperationException($"Item compendium entry '{entry.Id}' is already registered.");
        }

        _entries[entry.Id] = entry;
    }

    public IReadOnlyCollection<ItemCompendiumEntry> Entries => _entries.Values.ToList();
}
