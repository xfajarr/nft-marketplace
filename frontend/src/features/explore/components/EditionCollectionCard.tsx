import { useNavigate } from 'react-router-dom';
import { Clock, Users, TrendingUp } from 'lucide-react';
import {
  EditionCollection,
  mistToSui,
  bpsToPercentage,
  getCollectionStatus,
} from '../hooks/useQueryEditionCollections';

interface EditionCollectionCardProps {
  collection: EditionCollection;
}

export default function EditionCollectionCard({ collection }: EditionCollectionCardProps) {
  const navigate = useNavigate();
  const status = getCollectionStatus(collection);

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    },
    live: {
      label: 'Live Now',
      className: 'bg-green-500/20 text-green-400 border-green-500/50',
    },
    ended: {
      label: 'Ended',
      className: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    },
    sold_out: {
      label: 'Sold Out',
      className: 'bg-red-500/20 text-red-400 border-red-500/50',
    },
  };

  const formatDate = (timestampMs: number) => {
    const date = new Date(timestampMs);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const progress = (collection.total_minted / collection.max_supply) * 100;

  return (
    <div
      onClick={() => navigate(`/collection/${collection.id}`)}
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer transform hover:scale-105"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={collection.image_url}
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[status].className}`}
          >
            {statusConfig[status].label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1">
            {collection.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Minted</span>
            <span className="text-white font-semibold">
              {collection.total_minted} / {collection.max_supply}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Price</div>
            <div className="text-sm font-bold text-cyan-400">
              {mistToSui(collection.mint_price).toFixed(2)} SUI
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Royalty</div>
            <div className="text-sm font-bold text-white">
              {bpsToPercentage(collection.royalty_bps)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Limit</div>
            <div className="text-sm font-bold text-white">
              {collection.mint_limit_per_wallet}
            </div>
          </div>
        </div>

        {/* Time Info */}
        {status === 'live' && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
            <Clock className="w-3 h-3" />
            <span>Ends {formatDate(collection.end_time_ms)}</span>
          </div>
        )}
        {status === 'upcoming' && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2 border-t border-slate-700/50">
            <Clock className="w-3 h-3" />
            <span>Starts {formatDate(collection.start_time_ms)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
