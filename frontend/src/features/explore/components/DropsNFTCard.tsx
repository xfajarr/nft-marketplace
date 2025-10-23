import { Eye, Heart, ExternalLink } from 'lucide-react';
import { DropsNFTData } from '../hooks/useQueryDropsNFTs';

interface DropsNFTCardProps {
  nft: DropsNFTData;
}

export default function DropsNFTCard({ nft }: DropsNFTCardProps) {
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
      {/* NFT Image */}
      <div className="relative aspect-square bg-slate-900 overflow-hidden">
        <img
          src={nft.image_url}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge for NFT Number */}
        <div className="absolute top-3 right-3 bg-cyan-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-bold text-white">#{nft.nft_number}</span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-cyan-400 transition-colors">
            {nft.name}
          </h3>
          <p className="text-sm text-slate-400 truncate">{nft.collection_name}</p>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-3">{nft.description}</p>

        {/* Owner Info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div>
            <p className="text-xs text-slate-500 mb-1">Owner</p>
            <p className="text-xs font-mono text-slate-300">{formatAddress(nft.owner)}</p>
          </div>
          <a
            href={`https://suiscan.xyz/testnet/object/${nft.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-700/50 hover:bg-cyan-500/20 rounded-lg transition-colors group/link"
          >
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover/link:text-cyan-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
