import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LaunchTypeSelection from '../../components/launch/LaunchTypeSelection';
import EditionCollectionForm from './components/EditionCollectionForm';
import DropsWizard from './components/drops/DropsWizard';

export type LaunchType = 'edition' | 'drops' | null;

export default function LaunchPage() {
  const navigate = useNavigate();
  const [launchType, setLaunchType] = useState<LaunchType>(null);

  const handleLaunchTypeSelect = (type: LaunchType) => {
    setLaunchType(type);
  };

  const handleSuccess = () => {
    // Navigate to explore or show success message
    navigate('/explore');
  };

  const handleBack = () => {
    setLaunchType(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${launchType === 'drops' ? 'max-w-6xl' : 'max-w-5xl'}`}>
        {!launchType ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Launch Your NFT</h1>
              <p className="text-slate-400">Create and launch your digital assets on Sui</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <LaunchTypeSelection onSelect={handleLaunchTypeSelect} />
            </div>
          </>
        ) : launchType === 'edition' ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <EditionCollectionForm
              onBack={handleBack}
              onSuccess={handleSuccess}
            />
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <DropsWizard
              onBack={handleBack}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}
