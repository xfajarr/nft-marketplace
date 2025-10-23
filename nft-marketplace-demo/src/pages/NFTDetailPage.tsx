import { ArrowLeft, Heart, Share2, MoreVertical, TrendingUp, Clock, Eye, Award } from 'lucide-react';
import { useState } from 'react';
import { mockNFTs } from '../data/mockData';

interface NFTDetailPageProps {
  nftId: string | null;
  onBack: () => void;
}

export default function NFTDetailPage({ nftId, onBack }: NFTDetailPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'offers'>('details');

  const nft = mockNFTs.find(n => n.id === nftId) || mockNFTs[0];
  const similarNFTs = mockNFTs.filter(n => n.collection === nft.collection && n.id !== nft.id).slice(0, 3);

  const tabs = [
    { id: 'details' as const, label: 'Details' },
    { id: 'history' as const, label: 'History' },
    { id: 'offers' as const, label: 'Offers' },
  ];

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

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50">
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <p className="text-slate-300 leading-relaxed">{nft.description}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Properties</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">
                      {attr.trait_type}
                    </div>
                    <div className="text-sm font-semibold text-white">{attr.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{attr.rarity}% have this</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-cyan-400 uppercase tracking-wide mb-2">{nft.collection}</div>
              <h1 className="text-4xl font-bold text-white mb-4">{nft.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-slate-400 mb-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{nft.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{nft.favorites} favorites</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                  <div>
                    <div className="text-xs text-slate-400">Owner</div>
                    <div className="text-sm font-medium text-white">{nft.owner}</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
                  <div>
                    <div className="text-xs text-slate-400">Creator</div>
                    <div className="text-sm font-medium text-white">{nft.creator}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Current Price</div>
                  <div className="text-4xl font-bold text-white">{nft.price} SUI</div>
                  <div className="text-sm text-slate-400 mt-1">≈ ${(nft.price * 1.85).toFixed(2)} USD</div>
                </div>
                {nft.lastSale && (
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">Last Sale</div>
                    <div className="text-2xl font-bold text-slate-300">{nft.lastSale} SUI</div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mb-4">
                <button className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25">
                  Buy Now
                </button>
                <button className="flex-1 py-4 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all border border-slate-600">
                  Make Offer
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all border ${
                    isLiked
                      ? 'bg-red-500/10 border-red-500/50 text-red-400'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 mx-auto ${isLiked ? 'fill-red-400' : ''}`} />
                </button>
                <button className="flex-1 py-3 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all">
                  <Share2 className="w-5 h-5 mx-auto" />
                </button>
                <button className="py-3 px-4 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50">
              <div className="flex border-b border-slate-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
                      <span className="text-slate-400">Contract Address</span>
                      <span className="text-white font-mono text-sm">{nft.contractAddress.slice(0, 10)}...</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
                      <span className="text-slate-400">Token ID</span>
                      <span className="text-white font-mono text-sm">{nft.tokenId}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
                      <span className="text-slate-400">Blockchain</span>
                      <span className="text-white font-semibold">{nft.blockchain}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-400">Creator Royalties</span>
                      <span className="text-white font-semibold">{nft.royalties}%</span>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {nft.history.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/30"
                      >
                        <div className="flex items-center space-x-3">
                          {event.event === 'Sale' && <TrendingUp className="w-5 h-5 text-green-400" />}
                          {event.event === 'Listed' && <Clock className="w-5 h-5 text-blue-400" />}
                          {event.event === 'Minted' && <Award className="w-5 h-5 text-purple-400" />}
                          <div>
                            <div className="text-white font-medium">{event.event}</div>
                            <div className="text-sm text-slate-400">{event.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {event.price && (
                            <div className="text-white font-semibold">{event.price} SUI</div>
                          )}
                          <div className="text-xs text-slate-400">
                            {event.from.slice(0, 6)}...{event.from.slice(-4)} → {event.to.slice(0, 6)}...{event.to.slice(-4)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div className="text-center py-8 text-slate-400">
                    No active offers yet. Be the first to make an offer!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {similarNFTs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">More from this Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarNFTs.map((similarNFT) => (
                <div
                  key={similarNFT.id}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={similarNFT.image}
                      alt={similarNFT.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-slate-400">{similarNFT.collection}</div>
                    <div className="text-lg font-semibold text-white mt-1">{similarNFT.title}</div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                      <div>
                        <div className="text-xs text-slate-400">Price</div>
                        <div className="text-lg font-bold text-cyan-400">{similarNFT.price} SUI</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
