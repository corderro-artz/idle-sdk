using IdleSdk.Core.Economy;
using IdleSdk.Core.Items;
using IdleSdk.Core.Trade;

namespace IdleSdk.Core.Tests.Trade;

public class TradeServiceTests
{
    [Fact]
    public void Trade_Purchase_Debits_Wallet_And_Adds_Item()
    {
        var itemRegistry = new ItemRegistry();
        itemRegistry.Register(new ItemDefinition("log", "Log", true));
        var inventory = new InventoryService(itemRegistry);

        var currencyRegistry = new CurrencyRegistry();
        currencyRegistry.Register(new CurrencyDefinition("gold", "Gold", false));
        var wallet = new WalletService(currencyRegistry);

        var trade = new TradeService(inventory, wallet);
        var profileId = Guid.NewGuid();
        wallet.Credit(profileId, "gold", 10);

        trade.ListOffer(new TradeOffer("offer1", "log", 1, 5));
        trade.Purchase(profileId, "offer1", "gold");

        Assert.Equal(5, wallet.GetOrCreateWallet(profileId).GetBalance("gold"));
        Assert.Equal(1, inventory.GetOrCreate(profileId).GetQuantity("log"));
    }
}
