import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sparkles, Flame, ArrowRight } from 'lucide-react';
import NFTCard from '../../components/NFTCard';
import { mockNFTs } from '../../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const featuredNFT = mockNFTs[0];
  const trendingNFTs = mockNFTs.slice(1, 4);
  const popularNFTs = mockNFTs.slice(4, 10);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Featured Collection</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Discover, collect, and trade
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> extraordinary NFTs</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                Explore the world's premier marketplace for digital collectibles and non-fungible tokens on the Sui blockchain.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/explore')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
                >
                  Explore Marketplace
                </button>
                <button className="px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700">
                  Learn More
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">124K+</div>
                  <div className="text-sm text-slate-400">Total NFTs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">42K+</div>
                  <div className="text-sm text-slate-400">Collectors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">8.2K+</div>
                  <div className="text-sm text-slate-400">Artists</div>
                </div>
              </div>
            </div>

            <div className="relative group cursor-pointer" onClick={() => navigate(`/nft/${featuredNFT.id}`)}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 group-hover:border-cyan-500/50 transition-all">
                <img
                  src={featuredNFT.image}
                  alt={featuredNFT.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/collection/collection-1');
                        }}
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {featuredNFT.collection}
                      </button>
                      <div className="text-2xl font-bold text-white mt-1">{featuredNFT.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Current Price</div>
                      <div className="text-2xl font-bold text-cyan-400 mt-1">{featuredNFT.price} SUI</div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Flame className="w-6 h-6 text-orange-400" />
              <h2 className="text-3xl font-bold text-white">Trending Now</h2>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onClick={() => navigate(`/nft/${nft.id}`)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <h2 className="text-3xl font-bold text-white">Popular NFTs</h2>
            </div>
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onClick={() => navigate(`/nft/${nft.id}`)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-800/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 text-lg">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect Wallet', description: 'Link your Sui wallet to start exploring and trading NFTs securely.' },
              { step: '02', title: 'Discover NFTs', description: 'Browse collections, filter by traits, and find the perfect digital assets.' },
              { step: '03', title: 'Trade & Collect', description: 'Buy, sell, or place bids on NFTs with ease and track your portfolio.' },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 group-hover:border-cyan-500/50 transition-all">
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
