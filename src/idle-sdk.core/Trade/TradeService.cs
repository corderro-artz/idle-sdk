using IdleSdk.Core.Economy;
using IdleSdk.Core.Items;

namespace IdleSdk.Core.Trade;

public sealed class TradeService
{
    private readonly List<TradeOffer> _offers = new();
    private readonly InventoryService _inventoryService;
    private readonly WalletService _walletService;

    public TradeService(InventoryService inventoryService, WalletService walletService)
    {
        _inventoryService = inventoryService ?? throw new ArgumentNullException(nameof(inventoryService));
        _walletService = walletService ?? throw new ArgumentNullException(nameof(walletService));
    }

    public IReadOnlyCollection<TradeOffer> Offers => _offers.AsReadOnly();

    public void ListOffer(TradeOffer offer)
    {
        if (offer is null)
        {
            throw new ArgumentNullException(nameof(offer));
        }

        _offers.Add(offer);
    }

    public void Purchase(Guid buyerId, string offerId, string currencyId)
    {
        var offer = _offers.FirstOrDefault(o => o.Id == offerId);
        if (offer is null)
        {
            throw new KeyNotFoundException($"Offer '{offerId}' was not found.");
        }

        _walletService.Debit(buyerId, currencyId, offer.Price);
        _inventoryService.AddItem(buyerId, offer.ItemId, offer.Quantity);
    }
}
