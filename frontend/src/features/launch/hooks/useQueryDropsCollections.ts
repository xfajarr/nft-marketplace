import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

export interface DropsCollectionData {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  banner_url: string | null;
  owner: string;
  creator: string;
  royalty_bps: number;
  max_supply: number;
  total_minted: number;
  mint_price: string;
  start_time_ms: string;
  end_time_ms: string | null;
  mint_limit_per_wallet: number | null;
  discord_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
}

/**
 * Hook to query Drops Collections owned by the current user
 */
export function useQueryDropsCollections() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["drops-collections", currentAccount?.address],
    queryFn: async (): Promise<DropsCollectionData[]> => {
      if (!currentAccount?.address) {
        return [];
      }

      try {
        // Query all DropsCollection objects created by the user
        // Note: DropsCollection is a shared object, not owned
        // We need to query by creator field using dynamic field query

        // First try: Get all DropsCollection objects (this will need filtering)
        const { data: allObjects } = await suiClient.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::drops_collection::DropsCollectionCreated`,
          },
          limit: 50,
          order: "descending",
        });

        const collections: DropsCollectionData[] = [];

        // Filter events by creator and get collection IDs
        for (const event of allObjects) {
          const eventData = event.parsedJson as any;
          if (eventData.creator === currentAccount.address) {
            const collectionId = eventData.collection_id;

            // Fetch the collection object
            try {
              const obj = await suiClient.getObject({
                id: collectionId,
                options: {
                  showContent: true,
                },
              });

              if (obj.data?.content && "fields" in obj.data.content) {
                const fields = obj.data.content.fields as any;

                collections.push({
                  id: collectionId,
                  name: fields.name || "",
                  description: fields.description || "",
                  thumbnail_url: fields.thumbnail_url || "",
                  banner_url: fields.banner_url?.vec?.[0] || null,
                  owner: fields.owner || "",
                  creator: fields.creator || "",
                  royalty_bps: parseInt(fields.royalty_bps || "0"),
                  max_supply: parseInt(fields.max_supply || "0"),
                  total_minted: parseInt(fields.total_minted || "0"),
                  mint_price: fields.mint_price || "0",
                  start_time_ms: fields.start_time_ms || "0",
                  end_time_ms: fields.end_time_ms?.vec?.[0] || null,
                  mint_limit_per_wallet: fields.mint_limit_per_wallet?.vec?.[0]
                    ? parseInt(fields.mint_limit_per_wallet.vec[0])
                    : null,
                  discord_url: fields.discord_url?.vec?.[0] || null,
                  twitter_url: fields.twitter_url?.vec?.[0] || null,
                  website_url: fields.website_url?.vec?.[0] || null,
                });
              }
            } catch (error) {
              console.error(`Error fetching collection ${collectionId}:`, error);
            }
          }
        }

        return collections;
      } catch (error) {
        console.error("Error fetching drops collections:", error);
        return [];
      }
    },
    enabled: !!currentAccount?.address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
