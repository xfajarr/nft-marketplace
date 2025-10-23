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

export interface MintDropsNFTParams {
  collection_id: string;
  name: string;
  description: string;
  image_url: string;
  attributes: NFTAttribute[];
  mint_price: number; // in MIST
}

export interface MintDropsNFTResponse {
  digest: string;
  nftId?: string;
  effects?: {
    status: {
      status: string;
    };
  };
}

/**
 * Hook to mint a Drops NFT (mint + add attributes as dynamic fields)
 */
export function useMutateMintDropsNFT() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<MintDropsNFTResponse, Error, MintDropsNFTParams>({
    mutationFn: async (params: MintDropsNFTParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      const tx = new Transaction();

      // Split coins for payment
      const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(params.mint_price)]);

      // Call mint_nft function
      const [nft] = tx.moveCall({
        target: `${PACKAGE_ID}::drops_collection::mint_nft`,
        arguments: [
          tx.object(params.collection_id),
          tx.pure.string(params.name),
          tx.pure.string(params.description),
          tx.pure.string(params.image_url),
          payment,
          tx.object("0x6"), // Clock object
        ],
      });

      // Add attributes as dynamic fields
      for (const attr of params.attributes) {
        tx.moveCall({
          target: `${PACKAGE_ID}::nft::add_attribute`,
          arguments: [
            nft,
            tx.pure.string(attr.trait_type),
            tx.pure.string(attr.value),
          ],
        });
      }

      // Transfer NFT to minter
      tx.transferObjects([nft], tx.pure.address(currentAccount.address));

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

      // Extract NFT ID from object changes
      let nftId: string | undefined;
      if (transactionResult.objectChanges) {
        for (const change of transactionResult.objectChanges) {
          if (change.type === "created" && change.objectType.includes("::nft::Nft")) {
            nftId = change.objectId;
            break;
          }
        }
      }

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
        nftId,
        effects: transactionResult.effects,
      };
    },
    onSuccess: (data, variables) => {
      console.log("✅ Drops NFT minted successfully!");
      console.log("NFT ID:", data.nftId);
      console.log("Transaction digest:", data.digest);
      console.log("NFT name:", variables.name);
    },
    onError: (error) => {
      console.error("❌ Error minting Drops NFT:", error);
      console.error("Error message:", error.message);
    },
  });
}
