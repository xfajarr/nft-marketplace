import { useState } from 'react';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { DropsCollection } from './DropsCollectionForm';
import { DropsMetadata } from './DropsMetadataForm';

export interface DropsMintSettings {
  mint_price: string;
  start_time?: string;
  mint_duration?: number;
  mint_limit_per_address?: number;
  enable_allowlist: boolean;
  allowlist_addresses: string[];
}

interface DropsSettingsFormProps {
  collection: DropsCollection;
  metadata: DropsMetadata;
  onSubmit: (settings: DropsMintSettings) => void;
  onBack: () => void;
}

export default function DropsSettingsForm({ collection, metadata, onSubmit, onBack }: DropsSettingsFormProps) {
  const [formData, setFormData] = useState({
    mint_price: '0.5',
    start_time: '',
    mint_duration: 0,
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [useDuration, setUseDuration] = useState(false);
  const [startNow, setStartNow] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: DropsMintSettings = {
      mint_price: formData.mint_price,
      start_time: startNow ? undefined : (formData.start_time || undefined),
      mint_duration: useDuration ? formData.mint_duration : undefined,
      mint_limit_per_address: undefined, // No limit for drops (each NFT is unique)
      enable_allowlist: false, // Always public
      allowlist_addresses: [], // No allowlist
    };
    onSubmit(settings);
  };

  const tooltips = {
    price: 'The price in SUI that users will pay to mint each unique NFT.',
    startTime: 'When the minting will begin. Leave empty to start immediately after deployment.',
    duration: 'How long the mint will be open. Leave unchecked for unlimited duration.',
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
        <div className="absolute left-0 top-6 z-10 w-72 p-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 shadow-xl">
          {text}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Mint Settings</h2>
          <p className="text-slate-400">Configure pricing and mint parameters</p>
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

      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <div className="text-sm text-slate-300 space-y-1">
          <div><strong>Collection:</strong> {collection.name}</div>
          <div><strong>Unique NFTs:</strong> {metadata.nft_images.length} images uploaded</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Mint Price (SUI) *
            <Tooltip field="price" text={tooltips.price} />
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.mint_price}
            onChange={(e) => setFormData({ ...formData, mint_price: e.target.value })}
            placeholder="0.5"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Set to 0 for free minting</p>
        </div>

        <div>
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={startNow}
              onChange={(e) => {
                setStartNow(e.target.checked);
                if (e.target.checked) {
                  setFormData({ ...formData, start_time: '' });
                }
              }}
              className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            />
            <span className="text-sm font-semibold text-white">
              Start minting immediately after deployment
              <Tooltip field="startTime" text={tooltips.startTime} />
            </span>
          </label>
          {!startNow && (
            <>
              <label className="block text-sm font-semibold text-white mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-1">Set a specific date and time for minting to begin</p>
            </>
          )}
        </div>

        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={useDuration}
              onChange={(e) => setUseDuration(e.target.checked)}
              className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
            />
            <span className="text-sm font-semibold text-white">
              Set Mint Duration
              <Tooltip field="duration" text={tooltips.duration} />
            </span>
          </label>
          {useDuration && (
            <>
              <input
                type="number"
                min="1"
                value={formData.mint_duration}
                onChange={(e) => setFormData({ ...formData, mint_duration: parseInt(e.target.value) || 0 })}
                placeholder="Duration in hours"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-1">Duration in hours (e.g., 24 for one day, 168 for one week)</p>
            </>
          )}
        </div>

      </div>

      <div className="pt-6 border-t border-slate-700">
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-cyan-200">
            <strong>Public Mint:</strong> This collection is set to public mint by default. Anyone can mint NFTs from this collection.
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200">
          <strong>Gas Fees:</strong> Deploying this collection will require SUI for gas fees. Make sure you have enough SUI in your wallet before proceeding.
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
}
