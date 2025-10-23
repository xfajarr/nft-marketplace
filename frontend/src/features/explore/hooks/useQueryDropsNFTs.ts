import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

export interface DropsNFTData {
  id: string;
  name: string;
  description: string;
  image_url: string;
  collection_id: string;
  collection_name: string;
  nft_number: number;
  max_supply: number;
  creator: string;
  owner: string;
}

/**
 * Hook to query all Drops NFTs from blockchain events
 */
export function useQueryAllDropsNFTs() {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["all-drops-nfts"],
    queryFn: async (): Promise<string[]> => {
      try {
        // Query NFTMinted events for Drops collections
        const { data: events } = await suiClient.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::drops_collection::NFTMinted`,
          },
          limit: 50,
          order: "descending",
        });

        // Extract NFT IDs from events
        const nftIds = events.map((event) => {
          const eventData = event.parsedJson as any;
          return eventData.nft_id;
        });

        return nftIds;
      } catch (error) {
        console.error("Error fetching Drops NFTs:", error);
        return [];
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

/**
 * Hook to query individual Drops NFT data
 */
export function useQueryDropsNFT(nftId: string) {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["drops-nft", nftId],
    queryFn: async (): Promise<DropsNFTData | null> => {
      if (!nftId) return null;

      try {
        const obj = await suiClient.getObject({
          id: nftId,
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        if (!obj.data?.content || !("fields" in obj.data.content)) {
          return null;
        }

        const fields = obj.data.content.fields as any;
        const owner = obj.data.owner as any;

        return {
          id: nftId,
          name: fields.name || "",
          description: fields.description || "",
          image_url: fields.image_url || "",
          collection_id: fields.collection_id || "",
          collection_name: fields.collection_name || "",
          nft_number: parseInt(fields.nft_number || "0"),
          max_supply: parseInt(fields.max_supply || "0"),
          creator: fields.creator || "",
          owner: owner?.AddressOwner || "",
        };
      } catch (error) {
        console.error(`Error fetching Drops NFT ${nftId}:`, error);
        return null;
      }
    },
    enabled: !!nftId,
  });
}
