import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { PACKAGE_ID } from "../../../constants";

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadataItem {
  nft_number: number;
  name: string;
  description: string;
  image_url: string;
  attributes: NFTAttribute[];
}

export interface BatchUploadMetadataParams {
  collection_id: string;
  metadata_items: NFTMetadataItem[];
}

export interface BatchUploadMetadataResponse {
  digest: string;
  effects?: {
    status: {
      status: string;
    };
  };
  events?: any[];
}

/**
 * Hook to batch upload NFT metadata to a Drops Collection
 */
export function useMutateBatchUploadMetadata() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<
    BatchUploadMetadataResponse,
    Error,
    BatchUploadMetadataParams
  >({
    mutationFn: async (params: BatchUploadMetadataParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      if (params.metadata_items.length === 0) {
        throw new Error("No metadata items to upload");
      }

      const tx = new Transaction();

      // Upload metadata one by one in a single transaction
      // (Batch upload with complex nested structs is tricky, so we do multiple calls in one tx)
      for (const item of params.metadata_items) {
        // Create attribute structs
        const attributeArgs = item.attributes.map((attr) => {
          return tx.moveCall({
            target: `${PACKAGE_ID}::nft::new_attribute`,
            arguments: [
              tx.pure.string(attr.trait_type),
              tx.pure.string(attr.value),
            ],
          });
        });

        // Make vector of attributes - must specify type when empty
        const attributesVector = tx.makeMoveVec({
          type: `${PACKAGE_ID}::nft::Attribute`,
          elements: attributeArgs,
        });

        tx.moveCall({
          target: `${PACKAGE_ID}::drops_collection::upload_metadata`,
          arguments: [
            tx.object(params.collection_id),
            tx.pure.u64(item.nft_number),
            tx.pure.string(item.name),
            tx.pure.string(item.image_url),
            attributesVector,
          ],
        });
      }

      const result = await signAndExecute({
        transaction: tx,
      });

      const transactionResult = await suiClient.waitForTransaction({
        digest: result.digest,
        options: {
          showEffects: true,
          showEvents: true,
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

      return {
        digest: result.digest,
        effects: transactionResult.effects,
        events: transactionResult.events,
      };
    },
    onSuccess: (data, variables) => {
      console.log("✅ Metadata uploaded successfully!");
      console.log("Transaction digest:", data.digest);
      console.log(`Uploaded ${variables.metadata_items.length} NFT metadata items`);
    },
    onError: (error) => {
      console.error("❌ Error uploading metadata:", error);
      console.error("Error message:", error.message);
    },
  });
}
