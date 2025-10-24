import { useState } from 'react';
import { Info, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useQueryDropsCollections } from '../../hooks/useQueryDropsCollections';
import MediaInput from '../../../../components/ui/MediaInput';

export interface DropsCollection {
  id?: string; // undefined if creating new
  name: string;
  description: string;
  thumbnail_url: string;
  banner_url?: string;
  royalty_percentage: number;
  discord_url?: string;
  twitter_url?: string;
  website_url?: string;
}

interface DropsCollectionFormProps {
  onSubmit: (collection: DropsCollection) => void;
  onBack: () => void;
}

export default function DropsCollectionForm({ onSubmit, onBack }: DropsCollectionFormProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('create-new');
  const [isCreatingNew, setIsCreatingNew] = useState(true);

  const [formData, setFormData] = useState<DropsCollection>({
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

  // Fetch existing collections from blockchain
  const { data: existingCollections, isLoading: isLoadingCollections } = useQueryDropsCollections();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCollectionId !== 'create-new') {
      // Using existing collection
      const existing = existingCollections?.find(c => c.id === selectedCollectionId);
      if (existing) {
        onSubmit({
          id: existing.id,
          name: existing.name,
          description: existing.description,
          thumbnail_url: existing.thumbnail_url,
          banner_url: existing.banner_url || undefined,
          royalty_percentage: existing.royalty_bps / 100, // Convert bps to percentage
          discord_url: existing.discord_url || undefined,
          twitter_url: existing.twitter_url || undefined,
          website_url: existing.website_url || undefined,
        });
      }
    } else {
      // Creating new collection
      onSubmit(formData);
    }
  };

  const tooltips = {
    name: 'The name of your collection. This will be displayed across the marketplace.',
    description: 'A detailed description of your collection, its story, and what makes it unique.',
    thumbnail: 'A square image (recommended 512x512px) that represents your collection.',
    banner: 'A wide banner image (recommended 1400x400px) for your collection page.',
    royalty: 'The percentage of secondary sales that you will receive as the creator (0-10%).',
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
          <p className="text-slate-400">Choose or create a collection for your Drops launch</p>
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
          {isLoadingCollections ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="ml-2 text-slate-400">Loading collections...</span>
            </div>
          ) : (
            <select
              value={selectedCollectionId}
              onChange={(e) => {
                setSelectedCollectionId(e.target.value);
                setIsCreatingNew(e.target.value === 'create-new');
              }}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            >
              <option value="create-new">Create New Collection</option>
              {existingCollections && existingCollections.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.total_minted} minted)
                </option>
              ))}
            </select>
          )}
        </div>

        {isCreatingNew && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-start space-x-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-cyan-200">
              <strong>Note:</strong> Collection information can be edited later, but it's recommended to provide accurate details from the start.
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
              placeholder="Upload thumbnail image or paste IPFS URL"
            />
            <p className="text-xs text-slate-400 mt-1">Recommended: 512x512px, PNG or JPG</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Banner Image (Optional)
              <Tooltip field="banner" text={tooltips.banner} />
            </label>
            <MediaInput
              value={formData.banner_url || ''}
              onChange={(value) => setFormData({ ...formData, banner_url: value })}
              placeholder="Upload banner image or paste IPFS URL"
            />
            <p className="text-xs text-slate-400 mt-1">Recommended: 1400x400px, PNG or JPG</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">
              Creator Royalty Percentage *
              <Tooltip field="royalty" text={tooltips.royalty} />
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                required
                min="0"
                max="10"
                step="0.5"
                value={formData.royalty_percentage}
                onChange={(e) => setFormData({ ...formData, royalty_percentage: parseFloat(e.target.value) })}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
              <span className="text-white font-semibold">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              You'll earn this percentage on all secondary sales of your NFTs
            </p>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Social Links (Optional)
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discord</label>
            <input
              type="url"
              value={formData.discord_url}
              onChange={(e) => setFormData({ ...formData, discord_url: e.target.value })}
              placeholder="https://discord.gg/..."
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Twitter/X</label>
            <input
              type="url"
              value={formData.twitter_url}
              onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
              placeholder="https://twitter.com/..."
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-white mb-2">Website</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://yourproject.com"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
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
