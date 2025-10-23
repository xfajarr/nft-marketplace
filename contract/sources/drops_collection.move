module culture_meets_code::drops_collection {
    use std::string::String;
    use sui::clock::Clock;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use culture_meets_code::nft::{Self, Nft};

    /// Error Codes
    const E_ROYALTY_TOO_HIGH: u64 = 201;
    const E_INVALID_TIME: u64 = 203;
    const E_MINT_NOT_STARTED: u64 = 204;
    const E_MINT_ENDED: u64 = 205;
    const E_INSUFFICIENT_PAYMENT: u64 = 207;

    /// Maximum royalty is 10% (1000 basis points)
    const MAX_ROYALTY_BPS: u64 = 1000;

    /// Main Drops Collection struct (Simple, Unlimited Supply)
    public struct DropsCollection has key, store {
        id: UID,

        // Collection Info
        name: String,
        description: String,
        thumbnail_url: String,
        banner_url: Option<String>,

        // Ownership & Royalties
        owner: address,
        creator: address, // immutable, receives payment
        royalty_bps: u64, // basis points (500 = 5%)

        // Supply Tracking (no max limit)
        total_minted: u64,

        // Mint Config
        mint_price: u64,
        start_time_ms: u64,
        end_time_ms: Option<u64>, // None = unlimited duration

        // Social Links
        discord_url: Option<String>,
        twitter_url: Option<String>,
        website_url: Option<String>,
    }

    /// Event Structs
    public struct DropsCollectionCreated has copy, drop {
        collection_id: ID,
        name: String,
        creator: address,
        mint_price: u64,
    }

    public struct NFTMinted has copy, drop {
        collection_id: ID,
        nft_id: ID,
        nft_number: u64,
        minter: address,
        price_paid: u64,
    }

    /// Create a new Drops Collection (Simple, Unlimited)
    public fun create_collection(
        // Collection info
        name: String,
        description: String,
        thumbnail_url: String,
        banner_url: Option<String>,

        // Royalties
        royalty_bps: u64,

        // Mint config
        mint_price: u64,
        start_time_ms: u64,
        end_time_ms: Option<u64>,

        // Social links
        discord_url: Option<String>,
        twitter_url: Option<String>,
        website_url: Option<String>,

        ctx: &mut TxContext,
    ) {
        assert!(royalty_bps <= MAX_ROYALTY_BPS, E_ROYALTY_TOO_HIGH);

        let sender = ctx.sender();
        let collection_uid = object::new(ctx);
        let collection_id = object::uid_to_inner(&collection_uid);

        let collection = DropsCollection {
            id: collection_uid,
            name,
            description,
            thumbnail_url,
            banner_url,
            owner: sender,
            creator: sender,
            royalty_bps,
            total_minted: 0,
            mint_price,
            start_time_ms,
            end_time_ms,
            discord_url,
            twitter_url,
            website_url,
        };

        event::emit(DropsCollectionCreated {
            collection_id,
            name: collection.name,
            creator: sender,
            mint_price,
        });

        transfer::public_share_object(collection);
    }

    /// Mint NFT from Drops Collection
    public fun mint_nft(
        collection: &mut DropsCollection,
        name: String,
        description: String,
        image_url: String,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext,
    ): Nft {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();

        // Check mint window
        assert!(current_time >= collection.start_time_ms, E_MINT_NOT_STARTED);
        if (collection.end_time_ms.is_some()) {
            assert!(current_time <= *collection.end_time_ms.borrow(), E_MINT_ENDED);
        };

        // Check payment
        let payment_amount = payment.value();
        assert!(payment_amount >= collection.mint_price, E_INSUFFICIENT_PAYMENT);

        // Transfer payment to creator
        transfer::public_transfer(payment, collection.creator);

        // Increment counter
        collection.total_minted = collection.total_minted + 1;
        let nft_number = collection.total_minted;

        // Create NFT with required fields
        let nft = nft::create_drops_nft(
            name,
            description,
            image_url,
            object::uid_to_inner(&collection.id),
            collection.name,
            nft_number,
            collection.creator,
            ctx,
        );

        event::emit(NFTMinted {
            collection_id: object::uid_to_inner(&collection.id),
            nft_id: object::id(&nft),
            nft_number,
            minter: sender,
            price_paid: payment_amount,
        });

        nft
    }

    // === Getter Functions ===

    public fun name(collection: &DropsCollection): String {
        collection.name
    }

    public fun description(collection: &DropsCollection): String {
        collection.description
    }

    public fun thumbnail_url(collection: &DropsCollection): String {
        collection.thumbnail_url
    }

    public fun creator(collection: &DropsCollection): address {
        collection.creator
    }

    public fun royalty_bps(collection: &DropsCollection): u64 {
        collection.royalty_bps
    }

    public fun total_minted(collection: &DropsCollection): u64 {
        collection.total_minted
    }

    public fun mint_price(collection: &DropsCollection): u64 {
        collection.mint_price
    }

    // === Admin Functions ===

    /// Update collection owner
    public fun transfer_ownership(
        collection: &mut DropsCollection,
        new_owner: address,
        ctx: &TxContext,
    ) {
        assert!(ctx.sender() == collection.owner, 0);
        collection.owner = new_owner;
    }

    /// Update mint price (only owner)
    public fun update_mint_price(
        collection: &mut DropsCollection,
        new_price: u64,
        ctx: &TxContext,
    ) {
        assert!(ctx.sender() == collection.owner, 0);
        collection.mint_price = new_price;
    }
}
