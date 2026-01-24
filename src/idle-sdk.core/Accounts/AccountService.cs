namespace IdleSdk.Core.Accounts;

public sealed class AccountService
{
    private readonly Dictionary<Guid, RootAccount> _accounts = new();

    public RootAccount CreateAccount(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email must be provided.", nameof(email));
        }

        var account = new RootAccount(Guid.NewGuid(), email);
        _accounts[account.Id] = account;
        return account;
    }

    public RootAccount GetAccount(Guid accountId)
    {
        if (!_accounts.TryGetValue(accountId, out var account))
        {
            throw new KeyNotFoundException($"Account '{accountId}' was not found.");
        }

        return account;
    }
}
