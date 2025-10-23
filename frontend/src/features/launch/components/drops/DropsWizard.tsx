import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import DropsCollectionForm, { DropsCollection } from './DropsCollectionForm';
import DropsMetadataForm, { DropsMetadata } from './DropsMetadataForm';
import DropsSettingsForm, { DropsMintSettings } from './DropsSettingsForm';
import DropsReviewForm from './DropsReviewForm';
import { useMutateCreateDropsCollection } from '../../hooks/useMutateCreateDropsCollection';
import { useMutateMintDropsNFT } from '../../hooks/useMutateMintDropsNFT';

interface DropsWizardProps {
  onBack: () => void;
  onSuccess: () => void;
}

type WizardStep = 'collection' | 'metadata' | 'settings' | 'review';

export default function DropsWizard({ onBack, onSuccess }: DropsWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('collection');
  const [collectionData, setCollectionData] = useState<DropsCollection | null>(null);
  const [metadataData, setMetadataData] = useState<DropsMetadata | null>(null);
  const [settingsData, setSettingsData] = useState<DropsMintSettings | null>(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [createdCollectionId, setCreatedCollectionId] = useState<string | null>(null);

  const createCollection = useMutateCreateDropsCollection();
  const mintNFT = useMutateMintDropsNFT();

  const steps = [
    { id: 'collection', label: 'Collection', number: 1 },
    { id: 'metadata', label: 'NFT Details', number: 2 },
    { id: 'settings', label: 'Mint Settings', number: 3 },
    { id: 'review', label: 'Review', number: 4 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleCollectionSubmit = async (data: DropsCollection) => {
    setCollectionData(data);

    // If using existing collection, skip creation
    if (data.id) {
      setCreatedCollectionId(data.id);
      setCurrentStep('metadata');
      return;
    }

    // Create new collection on-chain (public, no allowlist)
    setIsCreatingCollection(true);
    try {
      const result = await createCollection.mutateAsync({
        name: data.name,
        description: data.description,
        thumbnail_url: data.thumbnail_url,
        banner_url: data.banner_url || null,
        royalty_bps: Math.round(data.royalty_percentage * 100), // Convert to basis points
        mint_price: 0, // Free mint by default (will be set from settings)
        start_time_ms: Date.now(),
        end_time_ms: null, // Unlimited duration
        discord_url: data.discord_url || null,
        twitter_url: data.twitter_url || null,
        website_url: data.website_url || null,
      });

      if (result.collectionId) {
        setCreatedCollectionId(result.collectionId);
        setCurrentStep('metadata');
      } else {
        throw new Error('Collection ID not found in transaction result');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleMetadataSubmit = (data: DropsMetadata) => {
    // Just save metadata, don't upload yet
    setMetadataData(data);
    setCurrentStep('settings');
  };

  const handleSettingsSubmit = (data: DropsMintSettings) => {
    setSettingsData(data);
    setCurrentStep('review');
  };

  const handleLaunch = async () => {
    // Mint NFT on launch (from review step)
    if (!createdCollectionId || !metadataData || !settingsData) {
      alert('Missing collection, metadata, or settings data');
      return;
    }

    try {
      const nft = metadataData.nft_images[0]; // Single NFT
      const mintPriceInMist = Math.floor(parseFloat(settingsData.mint_price) * 1_000_000_000);

      await mintNFT.mutateAsync({
        collection_id: createdCollectionId,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
        attributes: nft.attributes,
        mint_price: mintPriceInMist,
      });

      onSuccess();
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    }
  };

  const handleBackFromMetadata = () => {
    setCurrentStep('collection');
  };

  const handleBackFromSettings = () => {
    setCurrentStep('metadata');
  };

  const handleBackFromReview = () => {
    setCurrentStep('settings');
  };

  return (
    <div className="space-y-8 relative">
      {/* Loading Overlay */}
      {(isCreatingCollection || mintNFT.isPending) && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              <div className="text-center">
                <p className="text-white font-semibold">
                  {isCreatingCollection ? 'Creating Collection...' : 'Minting NFT...'}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {isCreatingCollection
                    ? 'Please confirm the transaction in your wallet'
                    : 'Creating your unique NFT on blockchain...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  index <= currentStepIndex
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  index <= currentStepIndex ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all ${
                  index < currentStepIndex ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>
        {currentStep === 'collection' && (
          <DropsCollectionForm onSubmit={handleCollectionSubmit} onBack={onBack} />
        )}

        {currentStep === 'metadata' && collectionData && (
          <DropsMetadataForm
            collection={collectionData}
            onSubmit={handleMetadataSubmit}
            onBack={handleBackFromMetadata}
          />
        )}

        {currentStep === 'settings' && collectionData && metadataData && (
          <DropsSettingsForm
            collection={collectionData}
            metadata={metadataData}
            onSubmit={handleSettingsSubmit}
            onBack={handleBackFromSettings}
          />
        )}

        {currentStep === 'review' && collectionData && metadataData && settingsData && (
          <DropsReviewForm
            collection={collectionData}
            metadata={metadataData}
            settings={settingsData}
            onBack={handleBackFromReview}
            onLaunch={handleLaunch}
          />
        )}
      </div>
    </div>
  );
}
