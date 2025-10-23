import { Image, Layers, Info } from 'lucide-react';
import { LaunchType } from '../../pages/LaunchPage';

interface LaunchTypeSelectionProps {
  onSelect: (type: LaunchType) => void;
}

export default function LaunchTypeSelection({ onSelect }: LaunchTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Launch Type</h2>
        <p className="text-slate-400">Select the type of NFT launch that best fits your project</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('edition')}
          className="group relative bg-slate-900/50 rounded-xl p-8 border-2 border-slate-700 hover:border-cyan-500 transition-all text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Image className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Edition</h3>
              <p className="text-slate-400 leading-relaxed">
                Perfect for single artworks or limited editions. All items share the same visual but have unique serial numbers.
              </p>
            </div>

            <div className="flex items-start space-x-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
              <span>Example: "Genesis Art #1 of 100" - Same image, different serial numbers</span>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span>Single image, multiple copies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span>Sequential serial numbers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span>Ideal for 1/1 or limited art</span>
                </div>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('drops')}
          className="group relative bg-slate-900/50 rounded-xl p-8 border-2 border-slate-700 hover:border-cyan-500 transition-all text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Layers className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Drops (Collection)</h3>
              <p className="text-slate-400 leading-relaxed">
                Perfect for PFP projects and large collections. Each NFT has unique images, traits, and metadata.
              </p>
            </div>

            <div className="flex items-start space-x-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
              <span>Example: "CryptoPunks" - 10,000 unique characters with different traits</span>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <span>Multiple unique images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <span>Diverse traits & attributes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  <span>Ideal for PFP collections</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
