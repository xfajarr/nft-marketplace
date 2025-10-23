import { ArrowLeft, Check, ExternalLink, Calendar, Clock, Coins, Users, Image as ImageIcon } from 'lucide-react';
import { Collection, LaunchType, NFTMetadata, MintSettings } from '../../pages/LaunchPage';

interface LaunchReviewProps {
  launchType: LaunchType;
  collection: Collection;
  nftMetadata: NFTMetadata;
  mintSettings: MintSettings;
  onPublish: () => void;
  onBack: () => void;
}

export default function LaunchReview({
  launchType,
  collection,
  nftMetadata,
  mintSettings,
  onPublish,
  onBack,
}: LaunchReviewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Review & Launch</h2>
          <p className="text-slate-400">Verify all details before publishing your launch</p>
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
        <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-cyan-200">
          Please review all information carefully. Once published, some settings cannot be changed.
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <span>Launch Type</span>
          </h3>
          <div className="ml-10">
            <div className="inline-flex px-4 py-2 bg-slate-800 rounded-lg">
              <span className="text-white font-semibold capitalize">{launchType}</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {launchType === 'edition'
                ? 'Limited edition with serial numbers'
                : 'Unique collection with multiple NFTs'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <span>Collection Details</span>
          </h3>
          <div className="ml-10 space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={collection.thumbnail_url}
                alt={collection.name}
                className="w-20 h-20 rounded-lg object-cover border border-slate-700"
              />
              <div className="flex-1">
                <div className="text-white font-semibold text-lg">{collection.name}</div>
                <div className="text-slate-400 text-sm mt-1">{collection.description}</div>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <div className="text-slate-400">
                    Royalty: <span className="text-white font-semibold">{collection.royalty_percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
            {(collection.discord_url || collection.twitter_url || collection.website_url) && (
              <div className="flex items-center space-x-3 pt-3 border-t border-slate-700/50">
                {collection.discord_url && (
                  <a
                    href={collection.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
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
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
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
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <span>NFT Metadata</span>
          </h3>
          <div className="ml-10 space-y-4">
            <div>
              <div className="text-white font-semibold">{nftMetadata.edition_name}</div>
              <div className="text-slate-400 text-sm mt-1">{nftMetadata.edition_description}</div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">
                  Supply: <span className="text-white font-semibold">{nftMetadata.edition_size}</span>
                </span>
              </div>
              {nftMetadata.image_urls.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">
                    Images: <span className="text-white font-semibold">{nftMetadata.image_urls.length}</span>
                  </span>
                </div>
              )}
            </div>
            {nftMetadata.image_urls.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto">
                {nftMetadata.image_urls.slice(0, 5).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`NFT ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                  />
                ))}
                {nftMetadata.image_urls.length > 5 && (
                  <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                    +{nftMetadata.image_urls.length - 5}
                  </div>
                )}
              </div>
            )}
            {nftMetadata.attributes.length > 0 && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="text-sm text-slate-400 mb-2">Attributes:</div>
                <div className="flex flex-wrap gap-2">
                  {nftMetadata.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-slate-800 rounded-lg text-sm"
                    >
                      <span className="text-slate-400">{attr.trait_type}:</span>{' '}
                      <span className="text-white font-medium">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <span>Mint Settings</span>
          </h3>
          <div className="ml-10 grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Coins className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400">Price</div>
                <div className="text-white font-semibold">{mintSettings.price_sui} SUI</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400">Start Time</div>
                <div className="text-white font-semibold text-sm">{formatDate(mintSettings.start_time)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400">Duration</div>
                <div className="text-white font-semibold">{mintSettings.duration_hours} hours</div>
              </div>
            </div>
            {mintSettings.mint_limit_per_address && (
              <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs text-slate-400">Mint Limit</div>
                  <div className="text-white font-semibold">{mintSettings.mint_limit_per_address} per wallet</div>
                </div>
              </div>
            )}
            {mintSettings.has_allowlist && mintSettings.allowlist_addresses && (
              <div className="md:col-span-2 flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <div className="text-xs text-slate-400">Allowlist</div>
                  <div className="text-white font-semibold">
                    {mintSettings.allowlist_addresses.filter(a => a.trim()).length} addresses whitelisted
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          By publishing, you agree to our Terms of Service
        </div>
        <button
          onClick={onPublish}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
        >
          Publish Launch
        </button>
      </div>
    </div>
  );
}
