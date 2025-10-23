import { useState } from 'react';
import { ArrowLeft, Grid3x3, List, ExternalLink, Twitter, Globe, MessageCircle } from 'lucide-react';
import NFTCard from '../components/NFTCard';
import Analytics from '../components/ui/Analytics';
import { mockNFTs } from '../data/mockData';

interface CollectionPageProps {
  collectionId: string | null;
  onBack: () => void;
  onNavigateToNFT: (nftId: string) => void;
}

export default function CollectionPage({ collectionId, onBack, onNavigateToNFT }: CollectionPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('price-low');
  
  // Mock collection data
  const collections = [
    {
      id: 'cosmic-wanderers',
      name: 'Cosmic Wanderers',
      description: 'An extraordinary collection of cosmic explorers navigating through the vast expanse of the digital universe. Each Wanderer represents a unique journey through space and time.',
      thumbnail_url: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=800',
      banner_url: 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=1200',
      creator: 'CosmicArtist',
      created_date: '2024-01-15',
      royalty_percentage: 5.0,
      discord_url: 'https://discord.gg/cosmicwanderers',
      twitter_url: 'https://twitter.com/cosmicwanderers',
      website_url: 'https://cosmicwanderers.io',
      total_supply: 500,
      total_minted: 342,
      floor_price: 12.5,
      total_volume: 8450.75,
      total_owners: 287
    },
    {
      id: 'cyber-warriors',
      name: 'Cyber Warriors',
      description: 'Elite warriors from the digital realm, each equipped with unique cybernetic enhancements and abilities. Join the resistance in the battle for digital sovereignty.',
      thumbnail_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
      banner_url: 'https://images.pexels.com/photos/538064/pexels-photo-538064.jpeg?auto=compress&cs=tinysrgb&w=1200',
      creator: 'CyberCreator',
      created_date: '2024-02-20',
      royalty_percentage: 7.5,
      discord_url: 'https://discord.gg/cyberwarriors',
      twitter_url: 'https://twitter.com/cyberwarriors',
      website_url: 'https://cyberwarriors.io',
      total_supply: 1000,
      total_minted: 756,
      floor_price: 8.75,
      total_volume: 12340.50,
      total_owners: 421
    },
    {
      id: 'aquatic-visions',
      name: 'Aquatic Visions',
      description: 'Dive into the depths of imagination with these mesmerizing aquatic creatures. Each piece captures the beauty and mystery of underwater worlds.',
      thumbnail_url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      banner_url: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=1200',
      creator: 'AquaArtist',
      created_date: '2024-03-10',
      royalty_percentage: 5.0,
      discord_url: 'https://discord.gg/aquaticvisions',
      twitter_url: 'https://twitter.com/aquaticvisions',
      website_url: 'https://aquaticvisions.io',
      total_supply: 333,
      total_minted: 198,
      floor_price: 15.0,
      total_volume: 5670.25,
      total_owners: 156
    }
  ];

  const collection = collections.find(c => c.id === collectionId) || collections[0];
  const collectionNFTs = mockNFTs.filter(nft => nft.collection === collection.name);

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'recent', label: 'Recently Listed' },
    { value: 'rare', label: 'Rarity: High to Low' },
  ];

  const sortedNFTs = [...collectionNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'recent':
        return b.id.localeCompare(a.id); // Simple mock for recent
      case 'rare':
        return b.views - a.views; // Using views as a mock for rarity
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Marketplace</span>
        </button>

        {/* Collection Header */}
        <div className="relative mb-8">
          <div className="h-64 md:h-80 rounded-2xl overflow-hidden relative">
            <img
              src={collection.banner_url}
              alt={`${collection.name} banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end space-x-6">
              <div className="relative -mt-16 md:-mt-20">
                <img
                  src={collection.thumbnail_url}
                  alt={collection.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-slate-900 object-cover"
                />
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{collection.name}</h1>
                <p className="text-slate-300 max-w-3xl">{collection.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Collection Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Analytics Card */}
            <Analytics
              floorPrice={collection.floor_price.toString()}
              volume={collection.total_volume.toString()}
              totalSales={collection.total_minted}
              owners={collection.total_owners}
            />

            {/* Collection Details */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Collection Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Creator</span>
                  <span className="text-white font-medium">{collection.creator}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="text-white font-medium">{collection.created_date}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Royalty</span>
                  <span className="text-white font-medium">{collection.royalty_percentage}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Supply</span>
                  <span className="text-white font-medium">{collection.total_minted}/{collection.total_supply}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              
              <div className="space-y-3">
                {collection.website_url && (
                  <a
                    href={collection.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Website</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                
                {collection.discord_url && (
                  <a
                    href={collection.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Discord</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
                
                {collection.twitter_url && (
                  <a
                    href={collection.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Items ({collectionNFTs.length})</h2>
                <p className="text-slate-400 mt-1">Browse the collection</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
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

            {collectionNFTs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Items Yet</h3>
                <p className="text-slate-400">This collection hasn't launched any items yet</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {sortedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} onClick={() => onNavigateToNFT(nft.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}