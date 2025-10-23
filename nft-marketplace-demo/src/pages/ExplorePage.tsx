import { Filter, SlidersHorizontal, Grid3x3, List, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import NFTCard from '../components/NFTCard';
import { mockNFTs } from '../data/mockData';

interface ExplorePageProps {
  onNavigateToNFT: (nftId: string) => void;
}

export default function ExplorePage({ onNavigateToNFT }: ExplorePageProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('trending');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['all']);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const collections = Array.from(new Set(mockNFTs.map(nft => nft.collection)));

  const statusOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'buy-now', label: 'Buy Now' },
    { id: 'auction', label: 'On Auction' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'recent', label: 'Recently Listed' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];
    const matchesCollection = selectedCollections.length === 0 || selectedCollections.includes(nft.collection);
    return matchesPrice && matchesCollection;
  });

  const toggleCollection = (collection: string) => {
    setSelectedCollections(prev =>
      prev.includes(collection)
        ? prev.filter(c => c !== collection)
        : [...prev, collection]
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Explore NFTs</h1>
            <p className="text-slate-400">Discover {filteredNFTs.length} unique digital assets</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-all">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-medium">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-all lg:hidden"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <aside className="w-80 flex-shrink-0 space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedStatus(['all']);
                      setSelectedCollections([]);
                      setPriceRange([0, 100]);
                    }}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Status</h4>
                    <div className="space-y-2">
                      {statusOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(option.id)}
                            onChange={() => {
                              if (option.id === 'all') {
                                setSelectedStatus(['all']);
                              } else {
                                setSelectedStatus(prev =>
                                  prev.includes(option.id)
                                    ? prev.filter(s => s !== option.id)
                                    : [...prev.filter(s => s !== 'all'), option.id]
                                );
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 focus:ring-2 bg-slate-700"
                          />
                          <span className="text-slate-300 group-hover:text-white transition-colors">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Price Range (SUI)</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          placeholder="Min"
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                        />
                        <span className="text-slate-400">to</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          placeholder="Max"
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Collections</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {collections.map((collection) => (
                        <label
                          key={collection}
                          className="flex items-center space-x-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(collection)}
                            onChange={() => toggleCollection(collection)}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 focus:ring-2 bg-slate-700"
                          />
                          <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                            {collection}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <main className="flex-1">
            {filteredNFTs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No NFTs Found</h3>
                <p className="text-slate-400">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} onClick={() => onNavigateToNFT(nft.id)} />
                ))}
              </div>
            )}

            {filteredNFTs.length > 0 && (
              <div className="mt-12 flex justify-center">
                <button className="px-8 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg font-medium hover:bg-slate-700 transition-all">
                  Load More
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
