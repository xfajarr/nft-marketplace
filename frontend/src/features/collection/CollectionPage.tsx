import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import {
  useQueryEditionCollection,
  mistToSui,
  bpsToPercentage,
  getCollectionStatus,
  isCollectionMintable,
} from '../explore/hooks/useQueryEditionCollections';
import { useMutateMintEdition } from '../launch/hooks/useMutateMintEdition';

export default function CollectionPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mintedData, setMintedData] = useState<{ digest: string; editionNumber?: number } | null>(null);

  const { data: collection, isLoading, error, refetch } = useQueryEditionCollection(collectionId);
  const { mutate: mintNFT, isPending: isMinting } = useMutateMintEdition();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400 font-medium">Collection not found</p>
          </div>
        </div>
      </div>
    );
  }

  const status = getCollectionStatus(collection);
  const canMint = isCollectionMintable(collection);
  const progress = (collection.total_minted / collection.max_supply) * 100;

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      canMint: false,
      message: 'Minting has not started yet',
    },
    live: {
      label: 'Live Now',
      className: 'bg-green-500/20 text-green-400 border-green-500/50',
      canMint: true,
      message: 'Minting is live!',
    },
    ended: {
      label: 'Ended',
      className: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
      canMint: false,
      message: 'Minting period has ended',
    },
    sold_out: {
      label: 'Sold Out',
      className: 'bg-red-500/20 text-red-400 border-red-500/50',
      canMint: false,
      message: 'All editions have been minted',
    },
  };

  const formatDate = (timestampMs: number) => {
    return new Date(timestampMs).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMint = () => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    if (!canMint) {
      alert(statusConfig[status].message);
      return;
    }

    mintNFT(
      {
        collectionId: collection.id,
        paymentAmount: collection.mint_price,
      },
      {
        onSuccess: (data) => {
          setMintedData({
            digest: data.digest,
            editionNumber: data.editionNumber,
          });
          setShowSuccessModal(true);
          // Refetch collection to update minted count
          refetch();
        },
      }
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Explore</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50">
                <img
                  src={collection.image_url}
                  alt={collection.name}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600?text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig[status].className}`}
              >
                {statusConfig[status].label}
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{collection.name}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">{collection.description}</p>
            </div>

            {/* Creator */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-1">Created by</div>
              <div className="text-white font-mono text-sm">
                {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Minting Progress</h3>
                <span className="text-2xl font-bold text-cyan-400">
                  {collection.total_minted} / {collection.max_supply}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-slate-400 text-center">
                {progress.toFixed(1)}% minted
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Mint Price</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {mistToSui(collection.mint_price).toFixed(2)} SUI
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Creator Royalty</div>
                <div className="text-2xl font-bold text-white">
                  {bpsToPercentage(collection.royalty_bps)}%
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Mint Limit</div>
                <div className="text-2xl font-bold text-white">
                  {collection.mint_limit_per_wallet} per wallet
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Available</div>
                <div className="text-2xl font-bold text-white">
                  {collection.max_supply - collection.total_minted}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Mint Schedule</h3>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-400">Start Time</div>
                  <div className="text-white font-medium">{formatDate(collection.start_time_ms)}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-400">End Time</div>
                  <div className="text-white font-medium">{formatDate(collection.end_time_ms)}</div>
                </div>
              </div>
            </div>

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={!canMint || isMinting || !currentAccount}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                canMint && currentAccount && !isMinting
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isMinting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Minting...</span>
                </span>
              ) : !currentAccount ? (
                'Connect Wallet to Mint'
              ) : !canMint ? (
                statusConfig[status].message
              ) : (
                `Mint for ${mistToSui(collection.mint_price).toFixed(2)} SUI`
              )}
            </button>

            {/* Info */}
            {canMint && currentAccount && (
              <div className="flex items-start space-x-2 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-cyan-400 mb-1">Ready to Mint</p>
                  <p>You can mint up to {collection.mint_limit_per_wallet} edition(s) from this collection.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && mintedData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Successfully Minted!</h2>
              <p className="text-slate-400">
                You minted edition #{mintedData.editionNumber} of {collection.name}
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Transaction</span>
                <a
                  href={`https://suiscan.xyz/testnet/tx/${mintedData.digest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {mintedData.digest.slice(0, 8)}...
                </a>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Edition</span>
                <span className="text-white font-semibold">#{mintedData.editionNumber}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                View in Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
