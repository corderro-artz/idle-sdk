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

    [Fact]
    public void AccountService_Rejects_Invalid_Email()
    {
        var service = new AccountService();

        Assert.Throws<ArgumentException>(() => service.CreateAccount(" "));
    }

    [Fact]
    public void AccountService_Throws_When_Account_Missing()
    {
        var service = new AccountService();

        Assert.Throws<KeyNotFoundException>(() => service.GetAccount(Guid.NewGuid()));
    }

    [Fact]
    public void RootAccount_Rejects_Invalid_Profile_Name()
    {
        var account = new RootAccount(Guid.NewGuid(), "user@example.com");

        Assert.Throws<ArgumentException>(() => account.AddProfile(" "));
    }
}
