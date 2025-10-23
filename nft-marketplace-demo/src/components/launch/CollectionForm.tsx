import { useState } from 'react';
import { Upload, Info, HelpCircle, ArrowLeft } from 'lucide-react';
import { Collection, LaunchType } from '../../pages/LaunchPage';

interface CollectionFormProps {
  launchType: LaunchType;
  onSubmit: (collection: Collection) => void;
  onBack: () => void;
}

export default function CollectionForm({ launchType, onSubmit, onBack }: CollectionFormProps) {
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
          <h2 className="text-2xl font-bold text-white mb-2">Create Collection</h2>
          <p className="text-slate-400">
            Define your collection metadata for {launchType === 'edition' ? 'Edition' : 'Drops'} launch
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

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-cyan-200">
          <strong>Note:</strong> Collection information can be edited later, but it's recommended to provide accurate details from the start.
        </div>
      </div>

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
          <div className="flex items-center space-x-4">
            {formData.thumbnail_url && (
              <img
                src={formData.thumbnail_url}
                alt="Thumbnail preview"
                className="w-24 h-24 rounded-lg object-cover border border-slate-700"
              />
            )}
            <div className="flex-1">
              <input
                type="url"
                required
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-2">Recommended: 512x512px, PNG or JPG</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-white mb-2">
            Banner Image (Optional)
            <Tooltip field="banner" text={tooltips.banner} />
          </label>
          <div className="flex items-center space-x-4">
            {formData.banner_url && (
              <img
                src={formData.banner_url}
                alt="Banner preview"
                className="w-48 h-16 rounded-lg object-cover border border-slate-700"
              />
            )}
            <div className="flex-1">
              <input
                type="url"
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-2">Recommended: 1400x400px, PNG or JPG</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-white mb-2">
            Creator Royalty Percentage *
            <Tooltip field="royalty" text={tooltips.royalty} />
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={formData.royalty_percentage}
              onChange={(e) => setFormData({ ...formData, royalty_percentage: parseFloat(e.target.value) })}
              className="flex-1 accent-cyan-500"
            />
            <div className="w-20 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-center font-semibold">
              {formData.royalty_percentage}%
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            You'll earn this percentage on all secondary sales of your NFTs
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Social Links (Optional)</h3>
        <div className="grid md:grid-cols-2 gap-6">
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
