import { useState } from 'react';
import { Info, HelpCircle, ArrowLeft } from 'lucide-react';
import { Collection, LaunchType } from '../../pages/LaunchPage';
import NumberInput from '../ui/NumberInput';
import MediaInput from '../ui/MediaInput';
import Dropdown from '../ui/Dropdown';

interface CollectionFormProps {
  launchType: LaunchType;
  onSubmit: (collection: Collection) => void;
  onBack: () => void;
}

export default function CollectionForm({ launchType, onSubmit, onBack }: CollectionFormProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | number>('create-new');
  const [isCreatingNew, setIsCreatingNew] = useState(true);
  
  const [formData, setFormData] = useState<Collection>({
    name: '',
    description: '',
    thumbnail_url: '',
    banner_url: '',
    royalty_percentage: 5.0,
    discord_url: '',
    twitter_url: '',
    website_url: '',
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Mock existing collections from the marketplace
  const existingCollections = [
    {
      id: 'cosmic-wanderers',
      name: 'Cosmic Wanderers',
      description: 'Explore the cosmos with our unique collection',
      thumbnail_url: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=800',
      royalty_percentage: 5.0
    },
    {
      id: 'cyber-warriors',
      name: 'Cyber Warriors',
      description: 'Elite warriors from the digital realm',
      thumbnail_url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
      royalty_percentage: 7.5
    },
    {
      id: 'aquatic-visions',
      name: 'Aquatic Visions',
      description: 'Dive into the depths of imagination',
      thumbnail_url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      royalty_percentage: 5.0
    },
  ];

  const collectionOptions = [
    { value: 'create-new', label: 'Create New Collection', description: 'Start a brand new collection' },
    ...existingCollections.map(collection => ({
      value: collection.id,
      label: collection.name,
      description: collection.description
    }))
  ];

  const handleCollectionChange = (value: string | number) => {
    setSelectedCollectionId(value);
    setIsCreatingNew(value === 'create-new');
    
    if (value !== 'create-new') {
      const selectedCollection = existingCollections.find(c => c.id === value);
      if (selectedCollection) {
        setFormData({
          ...selectedCollection,
          discord_url: '',
          twitter_url: '',
          website_url: '',
        });
      }
    } else {
      // Reset form for new collection
      setFormData({
        name: '',
        description: '',
        thumbnail_url: '',
        banner_url: '',
        royalty_percentage: 5.0,
        discord_url: '',
        twitter_url: '',
        website_url: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const tooltips = {
    name: 'The name of your collection. This will be displayed across the marketplace.',
    description: 'A detailed description of your collection, its story, and what makes it unique.',
    thumbnail: 'A square image (recommended 512x512px) that represents your collection.',
    banner: 'A wide banner image (recommended 1400x400px) for your collection page.',
    royalty: 'The percentage of secondary sales that you will receive as the creator (0-100%).',
    discord: 'Link to your project Discord server for community engagement.',
    twitter: 'Link to your project Twitter/X account for updates and announcements.',
    website: 'Your project website URL for additional information.',
  };

  const Tooltip = ({ field, text }: { field: string; text: string }) => (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(field)}
        onMouseLeave={() => setShowTooltip(null)}
        className="text-slate-400 hover:text-cyan-400 transition-colors ml-1"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {showTooltip === field && (
        <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 shadow-xl">
          {text}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Collection Setup</h2>
          <p className="text-slate-400">
            Choose or create a collection for your {launchType === 'edition' ? 'Edition' : 'Drops'} launch
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Select Collection
          </label>
          <Dropdown
            value={selectedCollectionId}
            onChange={handleCollectionChange}
            options={collectionOptions}
          />
        </div>

        {isCreatingNew && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-cyan-200">
              <strong>Note:</strong> Collection information can be edited later, but it's recommended to provide accurate details from the start.
            </div>
          </div>
        )}

        {!isCreatingNew && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                src={existingCollections.find(c => c.id === selectedCollectionId)?.thumbnail_url}
                alt="Collection thumbnail"
                className="w-16 h-16 rounded-lg object-cover border border-slate-600"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {existingCollections.find(c => c.id === selectedCollectionId)?.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {existingCollections.find(c => c.id === selectedCollectionId)?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isCreatingNew && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Collection Name *
              <Tooltip field="name" text={tooltips.name} />
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cosmic Warriors Collection"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Description *
              <Tooltip field="description" text={tooltips.description} />
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your collection, its story, and what makes it special..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Thumbnail Image *
              <Tooltip field="thumbnail" text={tooltips.thumbnail} />
            </label>
            <MediaInput
              value={formData.thumbnail_url}
              onChange={(value) => setFormData({ ...formData, thumbnail_url: value })}
              placeholder="Enter thumbnail URL or upload file"
              accept="image/*"
              className="mb-2"
            />
            <p className="text-xs text-slate-400">Recommended: 512x512px, PNG or JPG</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Banner Image (Optional)
              <Tooltip field="banner" text={tooltips.banner} />
            </label>
            <MediaInput
              value={formData.banner_url || ''}
              onChange={(value) => setFormData({ ...formData, banner_url: value })}
              placeholder="Enter banner URL or upload file"
              accept="image/*"
              className="mb-2"
            />
            <p className="text-xs text-slate-400">Recommended: 1400x400px, PNG or JPG</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Creator Royalty Percentage *
              <Tooltip field="royalty" text={tooltips.royalty} />
            </label>
            <NumberInput
              value={formData.royalty_percentage}
              onChange={(value) => setFormData({ ...formData, royalty_percentage: value })}
              min={0}
              max={50}
              step={0.5}
              suffix="%"
              className="mb-2"
            />
            <p className="text-xs text-slate-400">
              You'll earn this percentage on all secondary sales of your NFTs
            </p>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          {isCreatingNew ? 'Social Links (Optional)' : 'Additional Collection Settings'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {isCreatingNew && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Discord
                <Tooltip field="discord" text={tooltips.discord} />
              </label>
              <input
                type="url"
                value={formData.discord_url}
                onChange={(e) => setFormData({ ...formData, discord_url: e.target.value })}
                placeholder="https://discord.gg/..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          )}

          {isCreatingNew && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Twitter/X
                <Tooltip field="twitter" text={tooltips.twitter} />
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          )}

          {isCreatingNew && (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Website
                <Tooltip field="website" text={tooltips.website} />
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://yourproject.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          )}
          
          {!isCreatingNew && (
            <div className="md:col-span-2">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                  <strong>Using Existing Collection:</strong> Basic collection information will be inherited from the selected collection. Social links and other settings can be managed from your collection dashboard.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Continue to NFT Details
        </button>
      </div>
    </form>
  );
}
