import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { useMutateCreateEditionCollection, CreateEditionCollectionParams } from '../hooks/useMutateCreateEditionCollection';

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

interface NFTImage {
  url: string;
  file?: File;
  status: 'loading' | 'loaded' | 'error';
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
  const [nftImages, setNftImages] = useState<NFTImage[]>([]);
  const [bannerImage, setBannerImage] = useState<NFTImage | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [bannerInputMode, setBannerInputMode] = useState<'url' | 'upload'>('url');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempBannerUrl, setTempBannerUrl] = useState('');

  const { mutate: createCollection, isPending, error } = useMutateCreateEditionCollection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      // Validate form data
      if (!formData.name.trim()) throw new Error('Collection name is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (nftImages.length === 0) throw new Error('At least one NFT image is required');
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

      // Use first NFT image as thumbnail
      const thumbnailUrl = nftImages[0].url;
      const bannerUrl = bannerImage?.url || null;

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

      createCollection(params, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (err) => {
          setErrors(err.message);
        }
      });
    } catch (err) {
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

  const handleImageUrlChange = (url: string) => {
    setTempImageUrl(url);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setNftImages([]);
      return;
    }

    // Check if URL is valid
    try {
      new URL(trimmedUrl);
      // Add image with loading state and start timeout
      setNftImages([{ url: trimmedUrl, status: 'loading' }]);

      // Set timeout - if not loaded in 10 seconds, mark as error
      const timeoutId = setTimeout(() => {
        setNftImages(prev => {
          if (prev.length > 0 && prev[0].status === 'loading') {
            return [{ ...prev[0], status: 'error' }];
          }
          return prev;
        });
      }, 10000);

      // Store timeout ID to clear later
      (window as any).imageLoadTimeout = timeoutId;
    } catch {
      // Invalid URL format
      setNftImages([{ url: trimmedUrl, status: 'error' }]);
    }
  };

  const handleBannerUrlChange = (url: string) => {
    setTempBannerUrl(url);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setBannerImage(null);
      return;
    }

    // Check if URL is valid
    try {
      new URL(trimmedUrl);
      setBannerImage({ url: trimmedUrl, status: 'loading' });

      // Set timeout for banner too
      const timeoutId = setTimeout(() => {
        setBannerImage(prev => {
          if (prev && prev.status === 'loading') {
            return { ...prev, status: 'error' };
          }
          return prev;
        });
      }, 10000);

      (window as any).bannerLoadTimeout = timeoutId;
    } catch {
      setBannerImage({ url: trimmedUrl, status: 'error' });
    }
  };

  const handleRemoveImage = (index: number) => {
    setNftImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageLoad = (index: number) => {
    // Clear timeout on successful load
    if ((window as any).imageLoadTimeout) {
      clearTimeout((window as any).imageLoadTimeout);
    }
    setNftImages(prev => prev.map((img, i) =>
      i === index ? { ...img, status: 'loaded' as const } : img
    ));
  };

  const handleImageError = (index: number) => {
    // Clear timeout on error
    if ((window as any).imageLoadTimeout) {
      clearTimeout((window as any).imageLoadTimeout);
    }
    setNftImages(prev => prev.map((img, i) =>
      i === index ? { ...img, status: 'error' as const } : img
    ));
  };

  const handleBannerLoad = () => {
    if ((window as any).bannerLoadTimeout) {
      clearTimeout((window as any).bannerLoadTimeout);
    }
    if (bannerImage) {
      setBannerImage({ ...bannerImage, status: 'loaded' });
    }
  };

  const handleBannerError = () => {
    if ((window as any).bannerLoadTimeout) {
      clearTimeout((window as any).bannerLoadTimeout);
    }
    if (bannerImage) {
      setBannerImage({ ...bannerImage, status: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Take first file only
    const reader = new FileReader();

    reader.onloadstart = () => {
      setNftImages([{ url: '', file, status: 'loading' }]);
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        setNftImages([{
          url: event.target.result as string,
          file,
          status: 'loaded'
        }]);
      }
    };

    reader.onerror = () => {
      setNftImages([{ url: '', file, status: 'error' }]);
    };

    reader.readAsDataURL(file);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadstart = () => {
      setBannerImage({ url: '', file, status: 'loading' });
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerImage({
          url: event.target.result as string,
          file,
          status: 'loaded'
        });
      }
    };

    reader.onerror = () => {
      setBannerImage({ url: '', file, status: 'error' });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      setNftImages([{ url: '', file, status: 'loading' }]);
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        setNftImages([{
          url: event.target.result as string,
          file,
          status: 'loaded'
        }]);
      }
    };

    reader.onerror = () => {
      setNftImages([{ url: '', file, status: 'error' }]);
    };

    reader.readAsDataURL(file);
  };

  const handleBannerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      setBannerImage({ url: '', file, status: 'loading' });
    };

    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerImage({
          url: event.target.result as string,
          file,
          status: 'loaded'
        });
      }
    };

    reader.onerror = () => {
      setBannerImage({ url: '', file, status: 'error' });
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setImageInputMode('url')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                imageInputMode === 'url'
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔗 URL
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode('upload')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                imageInputMode === 'upload'
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📤 Upload
            </button>
          </div>

          {/* URL Input Mode */}
          {imageInputMode === 'url' && (
            <div>
              <input
                type="url"
                value={tempImageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Paste image URL here..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
            </div>
          )}

          {/* Upload Mode */}
          {imageInputMode === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <input
                type="file"
                id="nft-image-upload"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="nft-image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop image here or click to upload</p>
                    <p className="text-sm text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Image Preview - Real-time */}
          {nftImages.length > 0 && (
            <div className="relative w-48 h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 mx-auto">
              {nftImages[0].status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-slate-400 text-xs">Loading...</p>
                </div>
              )}
              {nftImages[0].status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10">
                  <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-400 text-xs font-medium">Failed to load</p>
                </div>
              )}
              {nftImages[0].url && (
                <img
                  src={nftImages[0].url}
                  alt="NFT Preview"
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(0)}
                  onError={() => handleImageError(0)}
                />
              )}
            </div>
          )}
        </div>

        {/* Banner Image */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Banner Image (Optional)</h3>
            <Info className="w-4 h-4 text-slate-400" />
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setBannerInputMode('url')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                bannerInputMode === 'url'
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔗 URL
            </button>
            <button
              type="button"
              onClick={() => setBannerInputMode('upload')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                bannerInputMode === 'upload'
                  ? 'bg-slate-700 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📤 Upload
            </button>
          </div>

          {/* URL Input Mode */}
          {bannerInputMode === 'url' && (
            <div>
              <input
                type="url"
                value={tempBannerUrl}
                onChange={(e) => handleBannerUrlChange(e.target.value)}
                placeholder="Paste banner image URL here..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
            </div>
          )}

          {/* Upload Mode */}
          {bannerInputMode === 'upload' && (
            <div
              onDrop={handleBannerDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <input
                type="file"
                id="banner-image-upload"
                accept="image/*"
                onChange={handleBannerFileUpload}
                className="hidden"
              />
              <label htmlFor="banner-image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop banner here or click to upload</p>
                    <p className="text-sm text-slate-400 mt-1">Recommended: 1500x500px, PNG or JPG</p>
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Banner Preview - Real-time */}
          {bannerImage && (
            <div className="relative w-full max-w-lg h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 mx-auto">
              {bannerImage.status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-slate-400 text-xs">Loading...</p>
                </div>
              )}
              {bannerImage.status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10">
                  <svg className="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-red-400 text-xs font-medium">Failed to load</p>
                </div>
              )}
              {bannerImage.url && (
                <img
                  src={bannerImage.url}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  onLoad={handleBannerLoad}
                  onError={handleBannerError}
                />
              )}
            </div>
          )}
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
