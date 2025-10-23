import { useState } from 'react';
import { Filter, SlidersHorizontal, Grid3x3, List, Loader2 } from 'lucide-react';
import { useQueryAllEditionCollections, useQueryEditionCollection } from './hooks/useQueryEditionCollections';
import EditionCollectionCard from './components/EditionCollectionCard';

export default function ExplorePage() {
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch collection IDs from events
  const { data: collectionIds, isLoading, error } = useQueryAllEditionCollections();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Explore Collections</h1>
            <p className="text-slate-400">
              Discover {collectionIds?.length || 0} edition collections on Sui
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-700 text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-slate-700 text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-slate-400">Loading collections from blockchain...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400 font-medium mb-2">Failed to load collections</p>
            <p className="text-sm text-slate-400">{error.message}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!collectionIds || collectionIds.length === 0) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Collections Yet</h3>
            <p className="text-slate-400 mb-6">
              Be the first to create an edition collection!
            </p>
            <a
              href="/launch"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Create Collection
            </a>
          </div>
        )}

        {/* Collections Grid */}
        {!isLoading && !error && collectionIds && collectionIds.length > 0 && (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {collectionIds.map((collectionId) => (
              <CollectionCardWrapper key={collectionId} collectionId={collectionId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Wrapper component to fetch individual collection data
 */
function CollectionCardWrapper({ collectionId }: { collectionId: string }) {
  const { data: collection, isLoading, error } = useQueryEditionCollection(collectionId);

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
        <div className="aspect-square bg-slate-700 rounded-lg mb-4" />
        <div className="h-4 bg-slate-700 rounded mb-2" />
        <div className="h-4 bg-slate-700 rounded w-2/3" />
      </div>
    );
  }

  if (error || !collection) {
    return null; // Skip collections that failed to load
  }

  return <EditionCollectionCard collection={collection} />;
}
