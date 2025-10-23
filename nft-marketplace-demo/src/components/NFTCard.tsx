import { Heart } from 'lucide-react';
import { useState } from 'react';

interface NFT {
  id: string;
  title: string;
  collection: string;
  image: string;
  price: number;
  lastSale?: number;
  owner: string;
}

interface NFTCardProps {
  nft: NFT;
  onClick: () => void;
}

export default function NFTCard({ nft, onClick }: NFTCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 animate-fadeIn"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-all duration-300 transform hover:scale-110 ${
            isLiked ? 'animate-pulse' : ''
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-slate-300 hover:text-red-400'
            }`}
          />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide transition-colors duration-300 group-hover:text-cyan-400">
            {nft.collection}
          </div>
          <div className="text-lg font-semibold text-white mt-1 truncate transition-colors duration-300 group-hover:text-cyan-100">
            {nft.title}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 transition-all duration-300 group-hover:border-cyan-500/30">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <div className="text-xs text-slate-400">Price</div>
            <div className="text-lg font-bold text-cyan-400 transition-colors duration-300 group-hover:text-cyan-300">
              {nft.price} SUI
            </div>
          </div>
          {nft.lastSale && (
            <div className="text-right transition-transform duration-300 group-hover:scale-105">
              <div className="text-xs text-slate-400">Last Sale</div>
              <div className="text-sm font-medium text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                {nft.lastSale} SUI
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
