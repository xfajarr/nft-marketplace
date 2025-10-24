import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

/**
 * Input parameters for creating an Edition Collection
 */
export interface CreateEditionCollectionParams {
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string | null;
  max_supply: number;
  mint_price: number; // in MIST (1 SUI = 10^9 MIST)
  start_time_ms: number; // Unix timestamp in milliseconds
  end_time_ms: number; // Unix timestamp in milliseconds
  mint_limit_per_wallet: number;
  royalty_bps: number; // Basis points (5% = 500 bps, max 1000 = 10%)
}

/**
 * Response from the transaction
 */
export interface CreateEditionCollectionResponse {
  digest: string;
  effects?: {
    status: {
      status: string;
    };
  };
  events?: unknown[];
}

/**
 * Hook to create an Edition Collection on Sui blockchain
 *
 * @returns Mutation hook with typed parameters
 *
 * @example
 * const { mutate, isPending } = useMutateCreateEditionCollection();
 *
 * mutate({
 *   name: "My Collection",
 *   description: "A cool collection",
 *   image_url: "https://...",
 *   banner_image_url: "https://...",
 *   max_supply: 1000,
 *   mint_price: 500000000, // 0.5 SUI in MIST
 *   start_time_ms: Date.now(),
 *   end_time_ms: Date.now() + 86400000, // 1 day
 *   mint_limit_per_wallet: 5,
 *   royalty_bps: 500 // 5%
 * });
 */
export function useMutateCreateEditionCollection() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<
    CreateEditionCollectionResponse,
    Error,
    CreateEditionCollectionParams
  >({
    mutationFn: async (params: CreateEditionCollectionParams) => {
      console.log('🚀 useMutateCreateEditionCollection: Starting collection creation');
      console.log('📝 Parameters:', params);
      console.log('👛 Current account:', currentAccount?.address);

      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      // Validate royalty percentage (max 10% = 1000 bps)
      if (params.royalty_bps > 1000 || params.royalty_bps < 0) {
        throw new Error("Royalty must be between 0% and 10% (0-1000 basis points)");
      }

      // Validate time range
      if (params.end_time_ms <= params.start_time_ms) {
        throw new Error("End time must be after start time");
      }

      // Validate supply
      if (params.max_supply <= 0) {
        throw new Error("Max supply must be greater than 0");
      }

      // Validate mint limit
      if (params.mint_limit_per_wallet <= 0) {
        throw new Error("Mint limit per wallet must be greater than 0");
      }

      console.log('🔧 Creating transaction...');
      const tx = new Transaction();

      console.log('📦 Adding move call to transaction...');
      tx.moveCall({
        target: `${PACKAGE_ID}::edition_collection::create_collection`,
        arguments: [
          tx.pure.string(params.name),
          tx.pure.string(params.description),
          tx.pure.string(params.image_url),
          params.banner_image_url
            ? tx.pure.option("string", params.banner_image_url)
            : tx.pure.option("string", null),
          tx.pure.u64(params.max_supply),
          tx.pure.u64(params.mint_price),
          tx.pure.u64(params.start_time_ms),
          tx.pure.u64(params.end_time_ms),
          tx.pure.u64(params.mint_limit_per_wallet),
          tx.pure.u64(params.royalty_bps),
        ],
      });

      console.log('📤 Signing and executing transaction...');
      const result = await signAndExecute({
        transaction: tx,
      });

      console.log('⏳ Waiting for transaction confirmation...');
      console.log('🔍 Transaction digest:', result.digest);

      const transactionResult = await suiClient.waitForTransaction({
        digest: result.digest,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      console.log('📊 Transaction result:', transactionResult);

      if (
        !transactionResult.effects?.status ||
        transactionResult.effects.status.status !== "success"
      ) {
        console.error('❌ Transaction failed:', transactionResult.effects?.status?.error);
        throw new Error(
          `Transaction failed on-chain: ${
            transactionResult.effects?.status?.error || "Unknown error"
          }`
        );
      }

      console.log('✅ Transaction successful!');
      return {
        digest: result.digest,
        effects: transactionResult.effects,
        events: transactionResult.events || [],
      };
    },
    onSuccess: (data) => {
      console.log("✅ useMutateCreateEditionCollection: Collection created successfully!");
      console.log("🔍 Transaction digest:", data.digest);
      console.log("📋 Events:", data.events);
    },
    onError: (error) => {
      console.error("❌ useMutateCreateEditionCollection: Error creating collection:", error);
      console.error("💬 Error message:", error.message);
      console.error("📚 Error stack:", error.stack);
    },
  });
}
