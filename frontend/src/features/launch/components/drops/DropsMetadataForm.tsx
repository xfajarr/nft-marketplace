import { useState } from 'react';
import { ArrowLeft, Plus, X, HelpCircle } from 'lucide-react';
import { DropsCollection } from './DropsCollectionForm';
import MediaInput from '../../../../components/ui/MediaInput';

export interface NFTImage {
  name: string;
  description: string;
  image_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface DropsMetadata {
  nft_images: NFTImage[];
}

interface DropsMetadataFormProps {
  collection: DropsCollection;
  onSubmit: (metadata: DropsMetadata) => void;
  onBack: () => void;
}

export default function DropsMetadataForm({ collection, onSubmit, onBack }: DropsMetadataFormProps) {
  // Single NFT, not array
  const [nftData, setNftData] = useState<NFTImage>({
    name: '',
    description: '',
    image_url: '',
    attributes: [],
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nftData.name || !nftData.description || !nftData.image_url) {
      alert('Please fill all required fields');
      return;
    }

    const metadata: DropsMetadata = {
      nft_images: [nftData], // Wrap in array for consistency
    };
    onSubmit(metadata);
  };

  const handleUpdateNFT = (field: keyof NFTImage, value: any) => {
    setNftData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAttribute = () => {
    setNftData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }],
    }));
  };

  const handleRemoveAttribute = (attrIndex: number) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== attrIndex),
    }));
  };

  const handleUpdateAttribute = (
    attrIndex: number,
    field: 'trait_type' | 'value',
    value: string
  ) => {
    setNftData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === attrIndex ? { ...attr, [field]: value } : attr
      ),
    }));
  };

  const tooltips = {
    images: 'Create your unique NFT with name, description, image, and attributes.',
    attributes: 'Define traits for this NFT (e.g., Background: Blue, Hat: Red).',
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
          <h2 className="text-2xl font-bold text-white mb-2">NFT Details</h2>
          <p className="text-slate-400">Define your collection metadata and assets</p>
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
          <div className="text-slate-400">{collection.description}</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-white mb-4 block">
            Mint NFT
            <Tooltip field="images" text={tooltips.images} />
          </label>

          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700 space-y-4">

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  NFT Name *
                </label>
                <input
                  type="text"
                  required
                  value={nftData.name}
                  onChange={(e) => handleUpdateNFT('name', e.target.value)}
                  placeholder="e.g., Cosmic Warrior #1"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={nftData.description}
                  onChange={(e) => handleUpdateNFT('description', e.target.value)}
                  placeholder="Describe this unique NFT..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">
                  Image URL *
                </label>
                <MediaInput
                  value={nftData.image_url}
                  onChange={(value) => handleUpdateNFT('image_url', value)}
                  placeholder="Upload NFT image or paste IPFS URL"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white">
                  Attributes / Traits (Optional)
                  <Tooltip field="attributes" text={tooltips.attributes} />
                </label>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Attribute</span>
                </button>
              </div>

              {nftData.attributes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  No attributes yet. Click "Add Attribute" to define traits.
                </p>
              ) : (
                <div className="space-y-2">
                  {nftData.attributes.map((attr, attrIndex) => (
                    <div key={attrIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={attr.trait_type}
                        onChange={(e) =>
                          handleUpdateAttribute(attrIndex, 'trait_type', e.target.value)
                        }
                        placeholder="Trait Type (e.g., Background)"
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) =>
                          handleUpdateAttribute(attrIndex, 'value', e.target.value)
                        }
                        placeholder="Value (e.g., Cosmic Blue)"
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attrIndex)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
