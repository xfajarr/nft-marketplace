import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { useMutateCreateEditionCollection, CreateEditionCollectionParams } from '../hooks/useMutateCreateEditionCollection';
import MediaInput from '../../../components/ui/MediaInput';

interface EditionCollectionFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
  max_supply: string;
  mint_price: string;
  start_time: string;
  end_time: string;
  mint_limit_per_wallet: string;
  royalty_percentage: string;
}


export default function EditionCollectionForm({ onBack, onSuccess }: EditionCollectionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    max_supply: '',
    mint_price: '',
    start_time: '',
    end_time: '',
    mint_limit_per_wallet: '',
    royalty_percentage: '5', // Default 5%
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  const { mutate: createCollection, isPending, error } = useMutateCreateEditionCollection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    console.log('🚀 EditionCollectionForm: Starting form submission');
    console.log('📝 Form data:', formData);
    console.log('🖼️ Image URL:', imageUrl);
    console.log('🎨 Banner URL:', bannerImageUrl);

    try {
      // Validate form data
      if (!formData.name.trim()) throw new Error('Collection name is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (!imageUrl.trim()) throw new Error('NFT image is required');
      if (!formData.max_supply || parseInt(formData.max_supply) <= 0) {
        throw new Error('Max supply must be greater than 0');
      }
      if (!formData.mint_price || parseFloat(formData.mint_price) < 0) {
        throw new Error('Mint price must be 0 or greater');
      }
      if (!formData.start_time) throw new Error('Start time is required');
      if (!formData.end_time) throw new Error('End time is required');
      if (!formData.mint_limit_per_wallet || parseInt(formData.mint_limit_per_wallet) <= 0) {
        throw new Error('Mint limit must be greater than 0');
      }

      // Convert to milliseconds for blockchain
      const startTimeMs = new Date(formData.start_time).getTime();
      const endTimeMs = new Date(formData.end_time).getTime();

      if (endTimeMs <= startTimeMs) {
        throw new Error('End time must be after start time');
      }

      // Convert royalty percentage to basis points (5% = 500 bps)
      const royaltyBps = Math.floor(parseFloat(formData.royalty_percentage) * 100);

      if (royaltyBps < 0 || royaltyBps > 1000) {
        throw new Error('Royalty must be between 0% and 10%');
      }

      // Convert SUI to MIST (1 SUI = 10^9 MIST)
      const mintPriceMist = Math.floor(parseFloat(formData.mint_price) * 1_000_000_000);

      // Use the uploaded image URL
      const thumbnailUrl = imageUrl;
      const bannerUrl = bannerImageUrl || null;

      const params: CreateEditionCollectionParams = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image_url: thumbnailUrl,
        banner_image_url: bannerUrl,
        max_supply: parseInt(formData.max_supply),
        mint_price: mintPriceMist,
        start_time_ms: startTimeMs,
        end_time_ms: endTimeMs,
        mint_limit_per_wallet: parseInt(formData.mint_limit_per_wallet),
        royalty_bps: royaltyBps,
      };

      console.log('✅ EditionCollectionForm: Validation passed, creating collection with params:', params);

      createCollection(params, {
        onSuccess: () => {
          console.log('✅ EditionCollectionForm: Collection created successfully');
          onSuccess?.();
        },
        onError: (err) => {
          console.error('❌ EditionCollectionForm: Collection creation failed:', err);
          setErrors(err.message);
        }
      });
    } catch (err) {
      console.error('❌ EditionCollectionForm: Form validation error:', err);
      if (err instanceof Error) {
        setErrors(err.message);
      } else {
        setErrors('An unexpected error occurred');
      }
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors) setErrors(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Edition Collection</h2>
          <p className="text-slate-400 mt-1">Fill in the details to launch your edition collection on Sui</p>
        </div>
        <button
          onClick={onBack}
          type="button"
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Error Display */}
      {(errors || error) && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm font-medium">
            {errors || error?.message || 'An error occurred'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Collection Info */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <span>Collection Information</span>
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Cosmic Wanderers"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your collection..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              required
            />
          </div>

        </div>

        {/* NFT Images */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">NFT Images *</h3>
            <Info className="w-4 h-4 text-slate-400" />
          </div>

          <MediaInput
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Upload NFT image or paste IPFS URL"
          />
        </div>

        {/* Banner Image */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Banner Image (Optional)</h3>
            <Info className="w-4 h-4 text-slate-400" />
          </div>

          <MediaInput
            value={bannerImageUrl}
            onChange={setBannerImageUrl}
            placeholder="Upload banner image or paste IPFS URL"
          />
        </div>

        {/* Supply & Pricing */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <h3 className="text-lg font-semibold text-white">Supply & Pricing</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Supply *
              </label>
              <input
                type="number"
                value={formData.max_supply}
                onChange={(e) => handleChange('max_supply', e.target.value)}
                placeholder="e.g., 1000"
                min="1"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Total number of NFTs in this edition</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mint Price (SUI) *
              </label>
              <input
                type="number"
                value={formData.mint_price}
                onChange={(e) => handleChange('mint_price', e.target.value)}
                placeholder="e.g., 0.5"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
              <p className="text-xs text-slate-400 mt-1">Price per NFT in SUI tokens</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mint Limit Per Wallet *
            </label>
            <input
              type="number"
              value={formData.mint_limit_per_wallet}
              onChange={(e) => handleChange('mint_limit_per_wallet', e.target.value)}
              placeholder="e.g., 5"
              min="1"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Maximum NFTs a single wallet can mint</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Royalty Percentage *
            </label>
            <input
              type="number"
              value={formData.royalty_percentage}
              onChange={(e) => handleChange('royalty_percentage', e.target.value)}
              placeholder="5"
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Creator royalty on secondary sales (0-10%)</p>
          </div>
        </div>

        {/* Mint Schedule */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <h3 className="text-lg font-semibold text-white">Mint Schedule</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium text-cyan-400">Time Zone Info</p>
              <p className="mt-1">All times are in your local timezone. They will be converted to UTC when creating the collection on-chain.</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg font-medium hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating Collection...' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}
