import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID } from "../../../constants";

/**
 * Edition Collection data structure from blockchain
 */
export interface EditionCollection {
  id: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string | null;
  owner: string;
  creator: string;
  royalty_bps: number;
  max_supply: number;
  total_minted: number;
  mint_price: number; // in MIST
  start_time_ms: number;
  end_time_ms: number;
  mint_limit_per_wallet: number;
}

/**
 * Hook to fetch all Edition Collections from blockchain
 *
 * @returns Query result with collections data
 *
 * @example
 * const { data: collections, isLoading, error } = useQueryEditionCollections();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return collections?.map(collection => (
 *   <div key={collection.id}>{collection.name}</div>
 * ));
 */
export function useQueryEditionCollections() {
  return useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: PACKAGE_ID, // This will be changed to query shared objects
      filter: {
        StructType: `${PACKAGE_ID}::edition_collection::EditionCollection`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      select: (data) => {
        // Transform the response data into our EditionCollection type
        return data.data
          .map((obj) => {
            if (
              obj.data?.content?.dataType === "moveObject" &&
              obj.data.content.type.includes("EditionCollection")
            ) {
              const fields = obj.data.content.fields as any;

              return {
                id: obj.data.objectId,
                name: fields.name || "",
                description: fields.description || "",
                image_url: fields.image_url || "",
                banner_image_url: fields.banner_image_url || null,
                owner: fields.owner || "",
                creator: fields.creator || "",
                royalty_bps: parseInt(fields.royalty_bps) || 0,
                max_supply: parseInt(fields.max_supply) || 0,
                total_minted: parseInt(fields.total_minted) || 0,
                mint_price: parseInt(fields.mint_price) || 0,
                start_time_ms: parseInt(fields.start_time_ms) || 0,
                end_time_ms: parseInt(fields.end_time_ms) || 0,
                mint_limit_per_wallet: parseInt(fields.mint_limit_per_wallet) || 0,
              } as EditionCollection;
            }
            return null;
          })
          .filter((collection): collection is EditionCollection => collection !== null);
      },
    }
  );
}

/**
 * Hook to fetch all Edition Collections using Dynamic Field query
 * This is the correct way to query shared objects on Sui
 */
export function useQueryAllEditionCollections() {
  return useSuiClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${PACKAGE_ID}::edition_collection::EditionCollectionCreated`,
      },
      limit: 50, // Adjust as needed
      order: "descending",
    },
    {
      select: (data) => {
        // Get collection IDs from events
        const collectionIds = data.data.map((event) => {
          const parsedJson = event.parsedJson as any;
          return parsedJson.collection_id;
        });

        return collectionIds;
      },
    }
  );
}

/**
 * Hook to fetch a single Edition Collection by ID
 *
 * @param collectionId - The object ID of the collection
 * @returns Query result with collection data
 */
export function useQueryEditionCollection(collectionId: string | undefined) {
  return useSuiClientQuery(
    "getObject",
    {
      id: collectionId!,
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!collectionId,
      select: (data) => {
        if (
          data.data?.content?.dataType === "moveObject" &&
          data.data.content.type.includes("EditionCollection")
        ) {
          const fields = data.data.content.fields as any;

          return {
            id: data.data.objectId,
            name: fields.name || "",
            description: fields.description || "",
            image_url: fields.image_url || "",
            banner_image_url: fields.banner_image_url || null,
            owner: fields.owner || "",
            creator: fields.creator || "",
            royalty_bps: parseInt(fields.royalty_bps) || 0,
            max_supply: parseInt(fields.max_supply) || 0,
            total_minted: parseInt(fields.total_minted) || 0,
            mint_price: parseInt(fields.mint_price) || 0,
            start_time_ms: parseInt(fields.start_time_ms) || 0,
            end_time_ms: parseInt(fields.end_time_ms) || 0,
            mint_limit_per_wallet: parseInt(fields.mint_limit_per_wallet) || 0,
          } as EditionCollection;
        }
        return null;
      },
    }
  );
}

/**
 * Helper function to convert MIST to SUI
 */
export function mistToSui(mist: number): number {
  return mist / 1_000_000_000;
}

/**
 * Helper function to convert basis points to percentage
 */
export function bpsToPercentage(bps: number): number {
  return bps / 100;
}

/**
 * Helper function to check if collection is currently mintable
 */
export function isCollectionMintable(collection: EditionCollection): boolean {
  const now = Date.now();
  return (
    now >= collection.start_time_ms &&
    now <= collection.end_time_ms &&
    collection.total_minted < collection.max_supply
  );
}

/**
 * Helper function to get collection status
 */
export function getCollectionStatus(collection: EditionCollection):
  "upcoming" | "live" | "ended" | "sold_out" {
  const now = Date.now();

  if (collection.total_minted >= collection.max_supply) {
    return "sold_out";
  }

  if (now < collection.start_time_ms) {
    return "upcoming";
  }

  if (now > collection.end_time_ms) {
    return "ended";
  }

  return "live";
}
