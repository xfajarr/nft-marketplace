import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

/**
 * Input parameters for minting an Edition NFT
 */
export interface MintEditionNFTParams {
  collectionId: string;
  mint_price: number; // in MIST (1 SUI = 10^9 MIST)
}

/**
 * Response from the transaction
 */
export interface MintEditionNFTResponse {
  digest: string;
  nftId?: string;
  effects?: {
    status: {
      status: string;
    };
  };
  events?: unknown[];
}

/**
 * Hook to mint an Edition NFT on Sui blockchain
 */
export function useMutateMintEditionNFT() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<
    MintEditionNFTResponse,
    Error,
    MintEditionNFTParams
  >({
    mutationFn: async (params: MintEditionNFTParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      try {
        // Step 1: Create and execute transaction
        const tx = new Transaction();

        tx.moveCall({
          target: `${PACKAGE_ID}::edition_collection::mint_edition`,
          arguments: [
            tx.object(params.collectionId), // Collection object
            tx.pure.u64(params.mint_price), // Payment amount
            tx.object("0x6"), // Clock object (testnet)
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
        let nftId: string | undefined;
        if (transactionResult.objectChanges) {
          for (const change of transactionResult.objectChanges) {
            if (
              change.type === "created" &&
              change.objectType.includes("nft::Nft")
            ) {
              nftId = change.objectId;
              break;
            }
          }
        }

        return {
          digest: result.digest,
          nftId,
          effects: transactionResult.effects,
          events: transactionResult.events || [],
        };
      } catch (error) {
        console.error("Error in mintEditionNFT:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Edition NFT minted successfully!");
      console.log("Transaction digest:", data.digest);
      console.log("NFT ID:", data.nftId);
      console.log("Events:", data.events);
    },
    onError: (error) => {
      console.error("❌ Error minting edition NFT:", error);
      console.error("Error message:", error.message);
    },
  });
}