namespace IdleSdk.Core.Input;

public sealed class HotkeyManager
{
    private readonly Dictionary<string, HotkeyBinding> _bindings = new(StringComparer.OrdinalIgnoreCase);

    public void Register(HotkeyBinding binding)
    {
        if (binding is null)
        {
            throw new ArgumentNullException(nameof(binding));
        }

        if (_bindings.ContainsKey(binding.ActionId))
        {
            throw new InvalidOperationException($"Hotkey action '{binding.ActionId}' is already registered.");
        }

        _bindings[binding.ActionId] = binding;
    }

    public void Rebind(string actionId, string keyCombination)
    {
        if (!_bindings.TryGetValue(actionId, out var existing))
        {
            throw new KeyNotFoundException($"Hotkey action '{actionId}' was not found.");
        }

        _bindings[actionId] = existing with { KeyCombination = keyCombination };
    }

    public HotkeyBinding Get(string actionId)
    {
        if (!_bindings.TryGetValue(actionId, out var binding))
        {
            throw new KeyNotFoundException($"Hotkey action '{actionId}' was not found.");
        }

        return binding;
    }

    public IReadOnlyCollection<HotkeyBinding> Bindings => _bindings.Values.ToList();
}
