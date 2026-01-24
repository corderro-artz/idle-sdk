using IdleSdk.Core.Accounts;

namespace IdleSdk.Core.Tests.Accounts;

public class AccountServiceTests
{
    [Fact]
    public void AccountService_Creates_Account_And_Profile()
    {
        var service = new AccountService();

        var account = service.CreateAccount("user@example.com");
        var profile = account.AddProfile("Main");

        Assert.NotEqual(Guid.Empty, account.Id);
        Assert.Single(account.Profiles);
        Assert.Equal(profile.Id, account.Profiles.First().Id);
    }
}
