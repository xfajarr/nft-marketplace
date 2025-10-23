module culture_meets_code::nft {
    use std::string::String;
    use sui::display;
    use sui::package;
    use sui::dynamic_field as df;

    public struct NFT has drop { }

    /// Attribute Key for dynamic fields on NFT
    public struct AttributeKey has store, copy, drop {
        trait_type: String,
    }

    /// Main NFT struct with required fields
    public struct Nft has key, store {
        id: UID,

        // Required fields (wajib ada)
        name: String,
        description: String,
        image_url: String,
        collection_id: ID,
        collection_name: String,

        // Creator & metadata
        creator: address,
        nft_number: u64, // Edition number OR drops number

        // Type indicator
        is_edition: bool,
        max_supply: Option<u64>, // For edition only
    }

    fun init(witness: NFT, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"description".to_string(),
            b"image_url".to_string(),
            b"collection_name".to_string(),
            b"creator".to_string(),
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{description}".to_string(),
            b"{image_url}".to_string(),
            b"{collection_name}".to_string(),
            b"{creator}".to_string(),
        ];

        let publisher = package::claim(witness, ctx);
        let mut display = display::new_with_fields<Nft>(&publisher, keys, values, ctx);
        display.update_version();

        transfer::public_transfer(display, ctx.sender());
        transfer::public_transfer(publisher, ctx.sender());
    }

    /// Create Edition NFT (serial numbered, same image)
    public fun create_edition_nft(
        name: String,
        description: String,
        image_url: String,
        collection_id: ID,
        edition_number: u64,
        max_supply: u64,
        creator: address,
        ctx: &mut TxContext
    ): Nft {
        Nft {
            id: object::new(ctx),
            name,
            description,
            image_url,
            collection_id,
            collection_name: name,
            creator,
            nft_number: edition_number,
            is_edition: true,
            max_supply: option::some(max_supply),
        }
    }

    /// Create Drops NFT (unique, attributes as dynamic fields)
    public fun create_drops_nft(
        name: String,
        description: String,
        image_url: String,
        collection_id: ID,
        collection_name: String,
        nft_number: u64,
        creator: address,
        ctx: &mut TxContext
    ): Nft {
        Nft {
            id: object::new(ctx),
            name,
            description,
            image_url,
            collection_id,
            collection_name,
            creator,
            nft_number,
            is_edition: false,
            max_supply: option::none(),
        }
    }

    /// Add attribute to NFT as dynamic field
    public fun add_attribute(
        nft: &mut Nft,
        trait_type: String,
        value: String,
    ) {
        let key = AttributeKey { trait_type };
        df::add(&mut nft.id, key, value);
    }

    /// Get attribute from NFT dynamic field
    public fun get_attribute(
        nft: &Nft,
        trait_type: String,
    ): &String {
        let key = AttributeKey { trait_type };
        df::borrow(&nft.id, key)
    }

    /// Check if NFT has attribute
    public fun has_attribute(
        nft: &Nft,
        trait_type: String,
    ): bool {
        let key = AttributeKey { trait_type };
        df::exists_(&nft.id, key)
    }

    // === Getter Functions ===

    public fun name(nft: &Nft): String {
        nft.name
    }

    public fun description(nft: &Nft): String {
        nft.description
    }

    public fun image_url(nft: &Nft): String {
        nft.image_url
    }

    public fun collection_id(nft: &Nft): ID {
        nft.collection_id
    }

    public fun collection_name(nft: &Nft): String {
        nft.collection_name
    }

    public fun creator(nft: &Nft): address {
        nft.creator
    }

    public fun nft_number(nft: &Nft): u64 {
        nft.nft_number
    }

    public fun is_edition(nft: &Nft): bool {
        nft.is_edition
    }
}
