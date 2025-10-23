import { useState } from 'react';
import HomePage from './pages/HomePage';
import NFTDetailPage from './pages/NFTDetailPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import LaunchPage from './pages/LaunchPage';
import CollectionPage from './pages/CollectionPage';
import Navigation from './components/Navigation';

type Page = 'home' | 'explore' | 'nft-detail' | 'profile' | 'launch' | 'collection';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const navigateToNFT = (nftId: string) => {
    setSelectedNFTId(nftId);
    setCurrentPage('nft-detail');
  };

  const navigateToCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setCurrentPage('collection');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToNFT={navigateToNFT} onNavigateToExplore={() => setCurrentPage('explore')} onNavigateToCollection={navigateToCollection} />;
      case 'explore':
        return <ExplorePage onNavigateToNFT={navigateToNFT} />;
      case 'nft-detail':
        return <NFTDetailPage nftId={selectedNFTId} onBack={() => setCurrentPage('explore')} />;
      case 'profile':
        return <ProfilePage onNavigateToNFT={navigateToNFT} />;
      case 'launch':
        return <LaunchPage onNavigateToExplore={() => setCurrentPage('explore')} />;
      case 'collection':
        return <CollectionPage collectionId={selectedCollectionId} onBack={() => setCurrentPage('explore')} onNavigateToNFT={navigateToNFT} />;
      default:
        return <HomePage onNavigateToNFT={navigateToNFT} onNavigateToExplore={() => setCurrentPage('explore')} onNavigateToCollection={navigateToCollection} />;
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
