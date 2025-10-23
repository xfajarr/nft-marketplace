import { useState } from 'react';
import LaunchTypeSelection from '../components/launch/LaunchTypeSelection';
import CollectionForm from '../components/launch/CollectionForm';
import NFTMetadataForm from '../components/launch/NFTMetadataForm';
import MintSettingsForm from '../components/launch/MintSettingsForm';
import LaunchReview from '../components/launch/LaunchReview';

export type LaunchType = 'edition' | 'drops' | null;

export interface Collection {
  id?: string;
  name: string;
  description: string;
  thumbnail_url: string;
  banner_url?: string;
  royalty_percentage: number;
  discord_url?: string;
  twitter_url?: string;
  website_url?: string;
}

export interface NFTMetadata {
  collection_id: string;
  edition_name: string;
  edition_description: string;
  edition_size: number;
  image_urls: string[];
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface MintSettings {
  price_sui: number;
  start_time: string;
  duration_hours: number;
  mint_limit_per_address?: number;
  has_allowlist: boolean;
  allowlist_addresses?: string[];
}

type LaunchStep = 'type' | 'collection' | 'metadata' | 'settings' | 'review';

interface LaunchPageProps {
  onNavigateToExplore: () => void;
}

export default function LaunchPage({ onNavigateToExplore }: LaunchPageProps) {
  const [currentStep, setCurrentStep] = useState<LaunchStep>('type');
  const [launchType, setLaunchType] = useState<LaunchType>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [mintSettings, setMintSettings] = useState<MintSettings | null>(null);

  const handleLaunchTypeSelect = (type: LaunchType) => {
    setLaunchType(type);
    setCurrentStep('collection');
  };

  const handleCollectionSubmit = (collectionData: Collection) => {
    setCollection(collectionData);
    setCurrentStep('metadata');
  };

  const handleMetadataSubmit = (metadata: NFTMetadata) => {
    setNftMetadata(metadata);
    setCurrentStep('settings');
  };

  const handleSettingsSubmit = (settings: MintSettings) => {
    setMintSettings(settings);
    setCurrentStep('review');
  };

  const handleBackToStep = (step: LaunchStep) => {
    setCurrentStep(step);
  };

  const handlePublishLaunch = async () => {
    console.log('Publishing launch:', {
      launchType,
      collection,
      nftMetadata,
      mintSettings,
    });
    onNavigateToExplore();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Launch Your NFT</h1>
          <p className="text-slate-400">Create and launch your digital assets on Sui</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['type', 'collection', 'metadata', 'settings', 'review'].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === step
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : ['type', 'collection', 'metadata', 'settings', 'review'].indexOf(currentStep) > index
                        ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500'
                        : 'bg-slate-800 text-slate-400 border-2 border-slate-700'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 capitalize hidden sm:block">
                    {step}
                  </div>
                </div>
                {index < 4 && (
                  <div
                    className={`h-1 flex-1 transition-all ${
                      ['type', 'collection', 'metadata', 'settings', 'review'].indexOf(currentStep) > index
                        ? 'bg-cyan-500'
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          {currentStep === 'type' && (
            <LaunchTypeSelection onSelect={handleLaunchTypeSelect} />
          )}

          {currentStep === 'collection' && launchType && (
            <CollectionForm
              launchType={launchType}
              onSubmit={handleCollectionSubmit}
              onBack={() => handleBackToStep('type')}
            />
          )}

          {currentStep === 'metadata' && launchType && collection && (
            <NFTMetadataForm
              launchType={launchType}
              collection={collection}
              onSubmit={handleMetadataSubmit}
              onBack={() => handleBackToStep('collection')}
            />
          )}

          {currentStep === 'settings' && nftMetadata && (
            <MintSettingsForm
              onSubmit={handleSettingsSubmit}
              onBack={() => handleBackToStep('metadata')}
            />
          )}

          {currentStep === 'review' && launchType && collection && nftMetadata && mintSettings && (
            <LaunchReview
              launchType={launchType}
              collection={collection}
              nftMetadata={nftMetadata}
              mintSettings={mintSettings}
              onPublish={handlePublishLaunch}
              onBack={() => handleBackToStep('settings')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
