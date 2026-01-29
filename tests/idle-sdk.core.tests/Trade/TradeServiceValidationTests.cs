using IdleSdk.Core.Economy;
using IdleSdk.Core.Items;
using IdleSdk.Core.Trade;

namespace IdleSdk.Core.Tests.Trade;

public class TradeServiceValidationTests
{
    [Fact]
    public void ListOffer_Rejects_Null()
    {
        var registry = new ItemRegistry();
        var inventory = new InventoryService(registry);
        var currencyRegistry = new CurrencyRegistry();
        var wallet = new WalletService(currencyRegistry);
        var trade = new TradeService(inventory, wallet);

        Assert.Throws<ArgumentNullException>(() => trade.ListOffer(null!));
    }

    [Fact]
    public void Purchase_Throws_When_Offer_Missing()
    {
        var registry = new ItemRegistry();
        var inventory = new InventoryService(registry);
        var currencyRegistry = new CurrencyRegistry();
        var wallet = new WalletService(currencyRegistry);
        var trade = new TradeService(inventory, wallet);

        Assert.Throws<KeyNotFoundException>(() => trade.Purchase(Guid.NewGuid(), "missing", "gold"));
    }
}
