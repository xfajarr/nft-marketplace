import { useState } from 'react';
import HomePage from './pages/HomePage';
import NFTDetailPage from './pages/NFTDetailPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import LaunchPage from './pages/LaunchPage';
import Navigation from './components/Navigation';

type Page = 'home' | 'explore' | 'nft-detail' | 'profile' | 'launch';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);

  const navigateToNFT = (nftId: string) => {
    setSelectedNFTId(nftId);
    setCurrentPage('nft-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToNFT={navigateToNFT} onNavigateToExplore={() => setCurrentPage('explore')} />;
      case 'explore':
        return <ExplorePage onNavigateToNFT={navigateToNFT} />;
      case 'nft-detail':
        return <NFTDetailPage nftId={selectedNFTId} onBack={() => setCurrentPage('explore')} />;
      case 'profile':
        return <ProfilePage onNavigateToNFT={navigateToNFT} />;
      case 'launch':
        return <LaunchPage onNavigateToExplore={() => setCurrentPage('explore')} />;
      default:
        return <HomePage onNavigateToNFT={navigateToNFT} onNavigateToExplore={() => setCurrentPage('explore')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
