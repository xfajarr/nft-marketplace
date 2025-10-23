module culture_meets_code::nft {
    use std::string::String;
    use sui::display;
    use sui::package;

    public struct NFT has drop { }

    public struct Nft has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        collection_id: ID,
        collection_name: String,
        creator: address,

        // Edition-Specific
        is_edition: bool,
        edition_number: Option<u64>,
        edition_max_supply: Option<u64>

        // Drops Specific - dynamic field to hold drop related data
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
            is_edition: true,
            edition_number: option::some(edition_number),
            edition_max_supply: option::some(max_supply),
        }
    }
}
