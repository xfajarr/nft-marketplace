import { useState } from 'react';
import { ArrowLeft, Plus, X, HelpCircle } from 'lucide-react';
import { Collection, LaunchType, NFTMetadata } from '../../pages/LaunchPage';
import Dropdown from '../ui/Dropdown';
import MediaInput from '../ui/MediaInput';

interface NFTMetadataFormProps {
  launchType: LaunchType;
  collection: Collection;
  onSubmit: (metadata: NFTMetadata) => void;
  onBack: () => void;
}

export default function NFTMetadataForm({ launchType, collection, onSubmit, onBack }: NFTMetadataFormProps) {
  const [formData, setFormData] = useState({
    edition_name: '',
    edition_description: '',
    edition_size: launchType === 'edition' ? 100 : 1000,
    edition_size_type: 'fixed',
    image_urls: [''],
    attributes: [{ trait_type: '', value: '' }],
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metadata: NFTMetadata = {
      collection_id: collection.id || '',
      edition_name: formData.edition_name,
      edition_description: formData.edition_description,
      edition_size: formData.edition_size_type === 'unlimited' ? 999999 : formData.edition_size,
      image_urls: formData.image_urls.filter(url => url.trim() !== ''),
      attributes: formData.attributes.filter(attr => attr.trait_type && attr.value),
    };
    onSubmit(metadata);
  };

  const addImageUrl = () => {
    setFormData({ ...formData, image_urls: [...formData.image_urls, ''] });
  };

  const removeImageUrl = (index: number) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index),
    });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...formData.image_urls];
    newUrls[index] = value;
    setFormData({ ...formData, image_urls: newUrls });
  };

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { trait_type: '', value: '' }],
    });
  };

  const removeAttribute = (index: number) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index),
    });
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...formData.attributes];
    newAttributes[index][field] = value;
    setFormData({ ...formData, attributes: newAttributes });
  };

  const tooltips = {
    edition_name: launchType === 'edition'
      ? 'The name of your edition (e.g., "Genesis Art"). Each minted copy will be numbered (e.g., "Genesis Art #1 of 100").'
      : 'The name of your NFT drop/collection (e.g., "Cosmic Warriors"). Each unique NFT will have this as its base name.',
    edition_size: launchType === 'edition'
      ? 'Total number of copies that will be available to mint. All copies share the same image but have unique serial numbers.'
      : 'Total number of unique NFTs in this collection. Each will have different images and potentially different traits.',
    images: launchType === 'edition'
      ? 'Upload the single image that will be used for all editions. This image will be shared by all minted copies.'
      : 'Upload all unique images for your collection. Each image represents a different NFT in your drop.',
    attributes: 'Define traits and attributes for your NFT(s). These are displayed as properties and can be used for filtering.',
  };

  const editionSizeOptions = [
    { value: 1, label: '1/1', description: 'Unique single edition' },
    { value: 'unlimited', label: 'Unlimited', description: 'No limit on editions' },
    { value: 'fixed', label: 'Fixed', description: 'Set custom edition size' },
  ];

  const commonEditionSizes = [
    { value: 10, label: '10', description: 'Small collection' },
    { value: 25, label: '25', description: 'Medium collection' },
    { value: 50, label: '50', description: 'Standard collection' },
    { value: 100, label: '100', description: 'Large collection' },
    { value: 500, label: '500', description: 'Extra large collection' },
    { value: 1000, label: '1000', description: 'Mass collection' },
  ];

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
          <h2 className="text-2xl font-bold text-white mb-2">NFT Details</h2>
          <p className="text-slate-400">
            Define your {launchType === 'edition' ? 'edition' : 'collection'} metadata and assets
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

      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <div className="text-sm text-slate-300">
          <strong>Collection:</strong> {collection.name}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {launchType === 'edition' ? 'Edition Name' : 'NFT Collection Name'} *
            <Tooltip field="edition_name" text={tooltips.edition_name} />
          </label>
          <input
            type="text"
            required
            value={formData.edition_name}
            onChange={(e) => setFormData({ ...formData, edition_name: e.target.value })}
            placeholder={launchType === 'edition' ? 'e.g., Genesis Art' : 'e.g., Cosmic Warriors'}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Description *
          </label>
          <textarea
            required
            value={formData.edition_description}
            onChange={(e) => setFormData({ ...formData, edition_description: e.target.value })}
            placeholder="Describe your NFT(s), their story, and unique features..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {launchType === 'edition' ? 'Edition Size (Total Supply)' : 'Collection Size (Total Supply)'} *
            <Tooltip field="edition_size" text={tooltips.edition_size} />
          </label>
          <Dropdown
            value={formData.edition_size_type}
            onChange={(value) => setFormData({ ...formData, edition_size_type: value as string })}
            options={editionSizeOptions}
            className="mb-3"
          />
          
          {formData.edition_size_type === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Set Edition Size
              </label>
              <Dropdown
                value={formData.edition_size}
                onChange={(value) => setFormData({ ...formData, edition_size: value as number })}
                options={commonEditionSizes}
                className="mb-2"
              />
              <input
                type="number"
                required
                min="1"
                value={typeof formData.edition_size === 'number' ? formData.edition_size : 100}
                onChange={(e) => setFormData({ ...formData, edition_size: parseInt(e.target.value) || 1 })}
                placeholder="Enter custom edition size"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          )}
          
          <p className="text-xs text-slate-400 mt-2">
            {launchType === 'edition'
              ? 'Number of copies that can be minted'
              : 'Total number of unique NFTs in this collection'}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-white">
            {launchType === 'edition' ? 'NFT Image' : 'NFT Images'} *
            <Tooltip field="images" text={tooltips.images} />
          </label>
          {launchType === 'drops' && (
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Image</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {formData.image_urls.map((url, index) => (
            <div key={index} className="space-y-2">
              <MediaInput
                value={url}
                onChange={(value) => updateImageUrl(index, value)}
                placeholder={`Enter ${launchType === 'edition' ? 'image' : `image-${index + 1}`} URL or upload file`}
                accept="image/*"
              />
              {launchType === 'drops' && formData.image_urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {launchType === 'edition' && (
          <p className="text-xs text-slate-400 mt-2">
            This single image will be used for all {formData.edition_size} editions
          </p>
        )}
        {launchType === 'drops' && (
          <p className="text-xs text-slate-400 mt-2">
            Upload {formData.edition_size} unique images for your collection (you can add more URLs)
          </p>
        )}
      </div>

      <div className="pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-white">
            Attributes / Traits (Optional)
            <Tooltip field="attributes" text={tooltips.attributes} />
          </label>
          <button
            type="button"
            onClick={addAttribute}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attribute</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.attributes.map((attr, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={attr.trait_type}
                onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                placeholder="Trait Type (e.g., Background)"
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                placeholder="Value (e.g., Cosmic Blue)"
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
              {formData.attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Continue to Mint Settings
        </button>
      </div>
    </form>
  );
}
