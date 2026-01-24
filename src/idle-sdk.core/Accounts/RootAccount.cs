namespace IdleSdk.Core.Accounts;

public sealed class RootAccount
{
    private readonly List<Profile> _profiles = new();

    public RootAccount(Guid id, string email)
    {
        Id = id;
        Email = email ?? throw new ArgumentNullException(nameof(email));
    }

    public Guid Id { get; }
    public string Email { get; }
    public IReadOnlyCollection<Profile> Profiles => _profiles.AsReadOnly();

    public Profile AddProfile(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Profile name must be provided.", nameof(name));
        }

        var profile = new Profile(Guid.NewGuid(), name, DateTimeOffset.UtcNow);
        _profiles.Add(profile);
        return profile;
    }
}
