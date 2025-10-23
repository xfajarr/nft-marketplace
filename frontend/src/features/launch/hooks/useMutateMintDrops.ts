import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

export interface MintDropsParams {
  collection_id: string;
  payment_amount: number; // in MIST
}

export interface MintDropsResponse {
  digest: string;
  nft_id?: string;
  effects?: {
    status: {
      status: string;
    };
  };
  events?: any[];
}

/**
 * Hook to mint a Drops NFT from a collection
 */
export function useMutateMintDrops() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<MintDropsResponse, Error, MintDropsParams>({
    mutationFn: async (params: MintDropsParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      const tx = new Transaction();

      // Split coin for payment
      const [coin] = tx.splitCoins(tx.gas, [params.payment_amount]);

      tx.moveCall({
        target: `${PACKAGE_ID}::drops_collection::mint_drops`,
        arguments: [
          tx.object(params.collection_id),
          coin,
          tx.object("0x6"), // Clock object
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

      // Extract NFT ID from object changes
      let nft_id: string | undefined;
      if (transactionResult.objectChanges) {
        for (const change of transactionResult.objectChanges) {
          if (
            change.type === "created" &&
            change.objectType.includes("nft::Nft")
          ) {
            nft_id = change.objectId;
            break;
          }
        }
      }

      return {
        digest: result.digest,
        nft_id,
        effects: transactionResult.effects,
        events: transactionResult.events,
      };
    },
    onSuccess: (data) => {
      console.log("✅ Drops NFT minted successfully!");
      console.log("Transaction digest:", data.digest);
      console.log("NFT ID:", data.nft_id);
    },
    onError: (error) => {
      console.error("❌ Error minting drops NFT:", error);
      console.error("Error message:", error.message);
    },
  });
}
