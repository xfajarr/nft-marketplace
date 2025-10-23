import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, Settings, Grid3x3, Activity } from 'lucide-react';
import { useState } from 'react';
import NFTCard from '../../components/NFTCard';
import { mockNFTs } from '../../data/mockData';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'owned' | 'activity' | 'favorites'>('owned');

  const ownedNFTs = mockNFTs.slice(0, 6);
  const favoriteNFTs = mockNFTs.slice(6, 9);

  const activityData = [
    { type: 'purchase', nft: 'Cosmic Wanderer #2847', price: 42.5, date: '2 hours ago', status: 'success' },
    { type: 'sale', nft: 'Cyber Samurai #156', price: 28.9, date: '1 day ago', status: 'success' },
    { type: 'listed', nft: 'Ocean Dreams #721', price: 15.3, date: '2 days ago', status: 'pending' },
    { type: 'bid', nft: 'Phoenix Rising #999', price: 45.0, date: '3 days ago', status: 'outbid' },
    { type: 'offer', nft: 'Tech Oracle #667', price: 18.5, date: '4 days ago', status: 'declined' },
  ];

  const tabs = [
    { id: 'owned' as const, label: 'Owned', icon: Grid3x3, count: ownedNFTs.length },
    { id: 'activity' as const, label: 'Activity', icon: Activity, count: activityData.length },
    { id: 'favorites' as const, label: 'Favorites', icon: TrendingUp, count: favoriteNFTs.length },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12">
          <div className="h-48 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl" />

          <div className="relative -mt-20 px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex items-end space-x-6">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 border-4 border-slate-900 flex items-center justify-center">
                  <Wallet className="w-16 h-16 text-white" />
                </div>

                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-white mb-2">My Collection</h1>
                  <div className="text-slate-400 font-mono">0x7f3a...9c2d</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0 mb-4">
                <button className="px-6 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg font-medium hover:bg-slate-700 transition-all">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-white">234.8 SUI</div>
                <div className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5%
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">NFTs Owned</div>
                <div className="text-2xl font-bold text-white">{ownedNFTs.length}</div>
                <div className="text-xs text-slate-400 mt-1">Across 4 collections</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Total Sales</div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  156.3 SUI
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="text-sm text-slate-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-white">312.6 SUI</div>
                <div className="text-xs text-red-400 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Last 30 days
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50">
          <div className="flex border-b border-slate-700/50 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'owned' && (
              <div>
                {ownedNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No NFTs Yet</h3>
                    <p className="text-slate-400 mb-6">Start your collection by exploring the marketplace</p>
                    <button
                      onClick={() => navigate('/explore')}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
                    >
                      Explore NFTs
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownedNFTs.map((nft) => (
                      <NFTCard key={nft.id} nft={nft} onClick={() => navigate(`/nft/${nft.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                {activityData.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'purchase' ? 'bg-green-500/20 text-green-400' :
                        activity.type === 'sale' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'listed' ? 'bg-yellow-500/20 text-yellow-400' :
                        activity.type === 'bid' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {activity.type === 'purchase' && <TrendingDown className="w-5 h-5" />}
                        {activity.type === 'sale' && <TrendingUp className="w-5 h-5" />}
                        {activity.type === 'listed' && <Grid3x3 className="w-5 h-5" />}
                        {activity.type === 'bid' && <Activity className="w-5 h-5" />}
                        {activity.type === 'offer' && <Wallet className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="text-white font-medium capitalize">{activity.type}</div>
                        <div className="text-sm text-slate-400">{activity.nft}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white font-semibold">{activity.price} SUI</div>
                      <div className="text-xs text-slate-400">{activity.date}</div>
                      <div className={`text-xs mt-1 ${
                        activity.status === 'success' ? 'text-green-400' :
                        activity.status === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {activity.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                {favoriteNFTs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h3>
                    <p className="text-slate-400">Start adding NFTs to your favorites</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteNFTs.map((nft) => (
                      <NFTCard key={nft.id} nft={nft} onClick={() => navigate(`/nft/${nft.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
