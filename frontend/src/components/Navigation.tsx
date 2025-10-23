import { Search, Menu, X, Wallet, User, Rocket } from 'lucide-react';
import { useState } from 'react';

type Page = 'home' | 'explore' | 'nft-detail' | 'profile' | 'launch' | 'collection';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'explore' as Page, label: 'Explore' },
    { id: 'home' as Page, label: 'Collections' },
    { id: 'launch' as Page, label: 'Launch' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 group-hover:rotate-3">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-cyan-300 group-hover:to-blue-400">
                NexusNFT
              </span>
            </button>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                    currentPage === item.id
                      ? 'bg-slate-800 text-white shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.5s ease-out forwards'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NFTs, collections, or creators..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => onNavigate('launch')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPage === 'launch'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/50'
              }`}
            >
              <Rocket className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              <span>Launch NFT</span>
            </button>
            <button className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-all duration-300 transform hover:scale-110 hover:text-cyan-400">
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPage === 'profile'
                  ? 'bg-slate-800 text-white shadow-lg shadow-cyan-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
              Connect Wallet
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 animate-slideDown">
          <div className="px-4 py-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:translate-x-2 ${
                  currentPage === item.id
                    ? 'bg-slate-800 text-white shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.3s ease-out forwards'
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('launch');
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'launch'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Launch NFT
            </button>
            <button
              onClick={() => {
                onNavigate('profile');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              Profile
            </button>
            <button className="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
