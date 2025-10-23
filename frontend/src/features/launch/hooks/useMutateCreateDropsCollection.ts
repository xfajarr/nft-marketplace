import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

/**
 * Input parameters for creating a Drops Collection (Simple, Unlimited Supply)
 */
export interface CreateDropsCollectionParams {
  // Collection info
  name: string;
  description: string;
  thumbnail_url: string;
  banner_url: string | null;

  // Royalty
  royalty_bps: number; // Basis points (5% = 500 bps, max 1000 = 10%)

  // Mint settings
  mint_price: number; // in MIST (1 SUI = 10^9 MIST)
  start_time_ms: number; // Unix timestamp in milliseconds
  end_time_ms: number | null; // Unix timestamp in milliseconds, null = unlimited

  // Social links
  discord_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
}

/**
 * Response from the transaction
 */
export interface CreateDropsCollectionResponse {
  digest: string;
  collectionId?: string;
  effects?: {
    status: {
      status: string;
    };
  };
  events?: any[];
}

/**
 * Hook to create a Drops Collection on Sui blockchain
 */
export function useMutateCreateDropsCollection() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<
    CreateDropsCollectionResponse,
    Error,
    CreateDropsCollectionParams
  >({
    mutationFn: async (params: CreateDropsCollectionParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      // Validate royalty percentage (max 10% = 1000 bps)
      if (params.royalty_bps > 1000 || params.royalty_bps < 0) {
        throw new Error("Royalty must be between 0% and 10% (0-1000 basis points)");
      }

      // Validate time range
      if (params.end_time_ms !== null && params.end_time_ms <= params.start_time_ms) {
        throw new Error("End time must be after start time");
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::drops_collection::create_collection`,
        arguments: [
          // Collection info
          tx.pure.string(params.name),
          tx.pure.string(params.description),
          tx.pure.string(params.thumbnail_url),
          params.banner_url
            ? tx.pure.option("string", params.banner_url)
            : tx.pure.option("string", null),

          // Royalty
          tx.pure.u64(params.royalty_bps),

          // Mint settings
          tx.pure.u64(params.mint_price),
          tx.pure.u64(params.start_time_ms),
          params.end_time_ms !== null
            ? tx.pure.option("u64", params.end_time_ms)
            : tx.pure.option("u64", null),

          // Social links
          params.discord_url
            ? tx.pure.option("string", params.discord_url)
            : tx.pure.option("string", null),
          params.twitter_url
            ? tx.pure.option("string", params.twitter_url)
            : tx.pure.option("string", null),
          params.website_url
            ? tx.pure.option("string", params.website_url)
            : tx.pure.option("string", null),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      const transactionResult = await suiClient.waitForTransaction({
        digest: result.digest,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      if (
        !transactionResult.effects?.status ||
        transactionResult.effects.status.status !== "success"
      ) {
        throw new Error(
          `Transaction failed on-chain: ${
            transactionResult.effects?.status?.error || "Unknown error"
          }`
        );
      }

      // Extract collection ID from object changes
      let collectionId: string | undefined;
      if (transactionResult.objectChanges) {
        for (const change of transactionResult.objectChanges) {
          if (
            change.type === "created" &&
            change.objectType.includes("drops_collection::DropsCollection")
          ) {
            collectionId = change.objectId;
            break;
          }
        }
      }

      return {
        digest: result.digest,
        collectionId,
        effects: transactionResult.effects,
        events: transactionResult.events,
      };
    },
    onSuccess: (data) => {
      console.log("✅ Drops Collection created successfully!");
      console.log("Transaction digest:", data.digest);
      console.log("Collection ID:", data.collectionId);
      console.log("Events:", data.events);
    },
    onError: (error) => {
      console.error("❌ Error creating drops collection:", error);
      console.error("Error message:", error.message);
    },
  });
}
