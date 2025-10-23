import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './features/home/HomePage';
import ExplorePage from './features/explore/ExplorePage';
import LaunchPage from './features/launch/LaunchPage';
import CollectionPage from './features/collection/CollectionPage';
import NFTDetailPage from './features/nft/NFTDetailPage';
import ProfilePage from './features/profile/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/launch" element={<LaunchPage />} />
          <Route path="/collection/:collectionId" element={<CollectionPage />} />
          <Route path="/nft/:nftId" element={<NFTDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
