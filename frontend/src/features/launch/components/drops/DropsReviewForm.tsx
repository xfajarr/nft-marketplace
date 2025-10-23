import { useState } from 'react';
import { ArrowLeft, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { DropsCollection } from './DropsCollectionForm';
import { DropsMetadata } from './DropsMetadataForm';
import { DropsMintSettings } from './DropsSettingsForm';

interface DropsReviewFormProps {
  collection: DropsCollection;
  metadata: DropsMetadata;
  settings: DropsMintSettings;
  onBack: () => void;
  onLaunch: () => void;
}

export default function DropsReviewForm({
  collection,
  metadata,
  settings,
  onBack,
  onLaunch
}: DropsReviewFormProps) {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleLaunch = async () => {
    setIsDeploying(true);
    // TODO: Implement actual deployment logic
    // This will call the smart contract deployment
    setTimeout(() => {
      onLaunch();
    }, 2000);
  };

  const formatDateTime = (datetime?: string) => {
    if (!datetime) return 'Immediately after deployment';
    return new Date(datetime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Review & Launch</h2>
          <p className="text-slate-400">Review your collection details before deployment</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          disabled={isDeploying}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Collection Info */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
            Collection Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Collection Name</label>
              <p className="text-white font-medium">{collection.name}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Royalty Percentage</label>
              <p className="text-white font-medium">{collection.royalty_percentage}%</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Description</label>
              <p className="text-white">{collection.description}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Thumbnail</label>
              <img
                src={collection.thumbnail_url}
                alt="Collection thumbnail"
                className="w-24 h-24 rounded-lg object-cover mt-2"
              />
            </div>
            {collection.banner_url && (
              <div className="md:col-span-2">
                <label className="text-sm text-slate-400">Banner</label>
                <img
                  src={collection.banner_url}
                  alt="Collection banner"
                  className="w-full max-w-lg h-24 rounded-lg object-cover mt-2"
                />
              </div>
            )}
          </div>

          {(collection.discord_url || collection.twitter_url || collection.website_url) && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <label className="text-sm text-slate-400 block mb-2">Social Links</label>
              <div className="flex flex-wrap gap-3">
                {collection.discord_url && (
                  <a
                    href={collection.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    <span>Discord</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {collection.twitter_url && (
                  <a
                    href={collection.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    <span>Twitter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {collection.website_url && (
                  <a
                    href={collection.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NFT Details */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
            NFT Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-slate-400">Total Unique NFTs</label>
              <p className="text-white font-medium">{metadata.nft_images.length} NFTs</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-3">
              NFT Preview
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metadata.nft_images.map((nft, index) => (
                <div key={index} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  <div className="aspect-square bg-slate-900 relative">
                    <img
                      src={nft.image_url}
                      alt={nft.name || `NFT #${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23334155" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-medium text-sm truncate">{nft.name || `NFT #${index + 1}`}</h4>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{nft.description}</p>
                    {nft.attributes.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <p className="text-slate-500 text-xs">{nft.attributes.length} attributes</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {metadata.nft_images.some(img => img.attributes.length > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <label className="text-sm text-slate-400 block mb-2">Sample Attributes</label>
              <div className="text-sm text-slate-300">
                {metadata.nft_images.find(img => img.attributes.length > 0)?.attributes.slice(0, 3).map((attr, i) => (
                  <div key={i} className="inline-flex items-center bg-slate-800 px-2 py-1 rounded mr-2 mb-2">
                    <span className="text-slate-400">{attr.trait_type}:</span>
                    <span className="text-white ml-1">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mint Settings */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
            Mint Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Mint Price</label>
              <p className="text-white font-medium">
                {parseFloat(settings.mint_price) === 0 ? 'Free' : `${settings.mint_price} SUI`}
              </p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Start Time</label>
              <p className="text-white font-medium">{formatDateTime(settings.start_time)}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Mint Duration</label>
              <p className="text-white font-medium">
                {settings.mint_duration ? `${settings.mint_duration} hours` : 'Unlimited'}
              </p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Mint Limit Per Address</label>
              <p className="text-white font-medium">
                {settings.mint_limit_per_address ? `${settings.mint_limit_per_address} NFTs` : 'No limit'}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Allowlist</label>
              <p className="text-white font-medium">
                {settings.enable_allowlist
                  ? `Enabled (${settings.allowlist_addresses.length} addresses)`
                  : 'Disabled - Public mint'}
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <h4 className="text-amber-400 font-semibold mb-2">Important Notice</h4>
          <ul className="text-sm text-amber-200 space-y-1 list-disc list-inside">
            <li>Deployment requires SUI for gas fees</li>
            <li>Collection details cannot be changed after deployment</li>
            <li>Make sure all information is correct before launching</li>
            <li>Images and metadata will be stored on-chain using dynamic fields</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="button"
          onClick={handleLaunch}
          disabled={isDeploying}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
        >
          {isDeploying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Deploying...</span>
            </>
          ) : (
            <span>Deploy Collection</span>
          )}
        </button>
      </div>
    </div>
  );
}
