import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

/**
 * Input parameters for minting an edition NFT
 */
export interface MintEditionParams {
  collectionId: string;
  paymentAmount: number; // in MIST
}

/**
 * Response from the mint transaction
 */
export interface MintEditionResponse {
  digest: string;
  nftId?: string;
  editionNumber?: number;
}

/**
 * Hook to mint an edition NFT from a collection
 *
 * @returns Mutation hook with typed parameters
 *
 * @example
 * const { mutate, isPending } = useMutateMintEdition();
 *
 * mutate({
 *   collectionId: "0x123...",
 *   paymentAmount: 100000000 // 0.1 SUI in MIST
 * });
 */
export function useMutateMintEdition() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation<MintEditionResponse, Error, MintEditionParams>({
    mutationFn: async (params: MintEditionParams) => {
      if (!currentAccount?.address) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      if (params.paymentAmount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }

      const tx = new Transaction();

      // Split coin for payment
      const [coin] = tx.splitCoins(tx.gas, [params.paymentAmount]);

      // Call mint_edition function
      tx.moveCall({
        target: `${import.meta.env.VITE_PACKAGE_ID}::edition_collection::mint_edition`,
        arguments: [
          tx.object(params.collectionId), // collection
          coin, // payment
          tx.object("0x6"), // clock object (shared object at 0x6)
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

      // Extract NFT ID and edition number from events
      let nftId: string | undefined;
      let editionNumber: number | undefined;

      if (transactionResult.events) {
        const mintEvent = transactionResult.events.find((event) =>
          event.type.includes("EditionMinted")
        );

        if (mintEvent && mintEvent.parsedJson) {
          const eventData = mintEvent.parsedJson as any;
          nftId = eventData.nft_id;
          editionNumber = parseInt(eventData.edition_number);
        }
      }

      return {
        digest: result.digest,
        nftId,
        editionNumber,
      };
    },
    onSuccess: (data) => {
      console.log("✅ NFT minted successfully!");
      console.log("Transaction digest:", data.digest);
      console.log("NFT ID:", data.nftId);
      console.log("Edition number:", data.editionNumber);
    },
    onError: (error) => {
      console.error("❌ Error minting NFT:", error);
      console.error("Error message:", error.message);
    },
  });
}
