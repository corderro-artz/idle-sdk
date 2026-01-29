using IdleSdk.Core.Economy;

namespace IdleSdk.Core.Tests.Economy;

public class WalletTests
{
    [Fact]
    public void Credit_Rejects_NonPositive()
    {
        var wallet = new Wallet();

        Assert.Throws<ArgumentOutOfRangeException>(() => wallet.Credit("gold", 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => wallet.Credit("gold", -1));
    }

    [Fact]
    public void Debit_Rejects_NonPositive()
    {
        var wallet = new Wallet();

        Assert.Throws<ArgumentOutOfRangeException>(() => wallet.Debit("gold", 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => wallet.Debit("gold", -1));
    }

    [Fact]
    public void Credit_And_Debit_Update_Balance()
    {
        var wallet = new Wallet();

        wallet.Credit("gold", 50);
        wallet.Debit("gold", 20);

        Assert.Equal(30, wallet.GetBalance("gold"));
    }
}
