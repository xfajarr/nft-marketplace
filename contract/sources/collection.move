module culture_meets_code::edition_collection {
    use std::string::String;
    use sui::clock::Clock;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::table::{Self, Table};

    /// Error Codes
    const E_ROYALTY_TOO_HIGH: u64 = 101;
    const E_INVALID_SUPPLY: u64 = 102;
    const E_INVALID_TIME: u64 = 103;
    const E_MINT_NOT_STARTED: u64 = 104;
    const E_MINT_ENDED: u64 = 105;
    const E_SOLD_OUT: u64 = 106;
    const E_INSUFFICIENT_PAYMENT: u64 = 107;
    const E_MINT_LIMIT_REACHED: u64 = 108;

    /// Maximum royalty is 10% (1000 basis points)
    const MAX_ROYALTY_BPS: u64 = 1000;

    /// Main Structs
    public struct EditionCollection has key, store {
        id: UID,

        // Metadata
        name: String,
        description: String,
        image_url: String,
        banner_image_url: Option<String>,

        // Ownership & Royalties
        owner: address,
        creator: address, // immutable, receives payment

        // Royalty (for secondary sales)
        royalty_bps: u64, // basis points (500 = 5%)

        // Supply Tracking
        max_supply: u64,
        total_minted: u64,
        nft_ids: vector<ID>,

        // Mint Config (uniform for all editions)
        mint_price: u64,
        start_time_ms: u64,
        end_time_ms: u64,
        mint_limit_per_wallet: u64,

        // Tracking
        minter_counts: Table<address, u64>,
    }
    /// Event Structs
    public struct EditionCollectionCreated has copy, drop {
        collection_id: ID,
        name: String,
        creator: address,
        max_supply: u64,
        mint_price: u64
    }

    public struct EditionMinted has copy, drop {
        collection_id: ID,
        nft_id: ID,
        edition_number: u64,
        minter: address,
        price_paid: u64
    }

    /// Create a new Edition Collection
    public fun create_collection(
        name: String,
        description: String,
        image_url: String,
        banner_image_url: Option<String>,
        max_supply: u64,
        mint_price: u64,
        start_time_ms: u64,
        end_time_ms: u64,
        mint_limit_per_wallet: u64,
        royalty_bps: u64,
        ctx: &mut TxContext
    ) {
        assert!(royalty_bps <= MAX_ROYALTY_BPS, E_ROYALTY_TOO_HIGH);
        assert!(max_supply > 0, E_INVALID_SUPPLY);
        assert!(end_time_ms > start_time_ms, E_INVALID_TIME);

        let sender = ctx.sender();

        let collection = EditionCollection {
            id: object::new(ctx),
            name,
            description,
            image_url,
            banner_image_url,
            owner: sender,
            creator: sender,
            royalty_bps,
            max_supply,
            total_minted: 0,
            nft_ids: vector::empty<ID>(),
            mint_price,
            start_time_ms,
            end_time_ms,
            mint_limit_per_wallet,
            minter_counts: table::new<address, u64>(ctx)
        };

        event::emit(EditionCollectionCreated {
            collection_id: object::uid_to_inner(&collection.id),
            name: collection.name,
            creator: sender,
            max_supply,
            mint_price
        });

        transfer::share_object(collection);
    }

    /// Mint an edition from the collection
    #[allow(lint(self_transfer))]
    public fun mint_edition(
        collection: &mut EditionCollection,
        mut payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();

        // Validations
        assert!(current_time >= collection.start_time_ms, E_MINT_NOT_STARTED);
        assert!(current_time <= collection.end_time_ms, E_MINT_ENDED);
        assert!(collection.total_minted < collection.max_supply, E_SOLD_OUT);
        assert!(payment.value() >= collection.mint_price, E_INSUFFICIENT_PAYMENT);

        let minted_count = get_mint_count(collection, sender);
        assert!(minted_count < collection.mint_limit_per_wallet, E_MINT_LIMIT_REACHED);
        
        let edition_number = collection.total_minted + 1;

        let nft = culture_meets_code::nft::create_edition_nft(
            collection.name,
            collection.description,
            collection.image_url,
            object::uid_to_inner(&collection.id),
            edition_number,
            collection.max_supply,
            collection.creator,
            ctx
        );
        
        let nft_id = object::id(&nft);

        let mint_coin = coin::split(&mut payment, collection.mint_price, ctx);
        transfer::public_transfer(mint_coin, collection.creator);

        if (payment.value() > 0) {
            transfer::public_transfer(payment, sender);
        } else {
            coin::destroy_zero(payment);
        };

        collection.nft_ids.push_back(nft_id);
        collection.total_minted = edition_number;

        if (collection.minter_counts.contains(sender)) {
            let count = collection.minter_counts.borrow_mut(sender);
            *count = *count + 1;
        } else {
            collection.minter_counts.add(sender, 1);
        };

        event::emit(EditionMinted {
            collection_id: object::uid_to_inner(&collection.id),
            nft_id,
            edition_number,
            minter: sender,
            price_paid: collection.mint_price,
        });

        transfer::public_transfer(nft, sender);
    }

    fun get_mint_count(
        collection: &EditionCollection,
        address: address
    ): u64 {
        if (collection.minter_counts.contains(address)) {
            *collection.minter_counts.borrow(address)
        } else {
            0
        }
    }

}
