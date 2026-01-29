using System.Collections.Concurrent;

namespace IdleSdk.Core.Events;

public sealed class EventHub
{
    private readonly ConcurrentDictionary<Type, List<Delegate>> _handlers = new();
    private readonly object _gate = new();

    public Action<Exception, object?>? HandlerException { get; set; }

    public EventSubscription Subscribe<TEvent>(Action<TEvent> handler)
    {
        if (handler is null)
        {
            throw new ArgumentNullException(nameof(handler));
        }

        var handlers = _handlers.GetOrAdd(typeof(TEvent), _ => new List<Delegate>());
        lock (_gate)
        {
            handlers.Add(handler);
        }

        return new EventSubscription(() => Unsubscribe(handler));
    }

    public void Publish<TEvent>(TEvent eventData)
    {
        List<Delegate>? snapshot = null;
        if (_handlers.TryGetValue(typeof(TEvent), out var handlers))
        {
            lock (_gate)
            {
                snapshot = handlers.ToList();
            }
        }

        if (snapshot is null)
        {
            return;
        }

        foreach (var handler in snapshot)
        {
            try
            {
                ((Action<TEvent>)handler)(eventData);
            }
            catch (Exception ex)
            {
                HandlerException?.Invoke(ex, eventData);
            }
        }
    }

    private void Unsubscribe<TEvent>(Action<TEvent> handler)
    {
        if (!_handlers.TryGetValue(typeof(TEvent), out var handlers))
        {
            return;
        }

        lock (_gate)
        {
            handlers.Remove(handler);
        }
    }
}
