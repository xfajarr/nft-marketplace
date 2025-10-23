import { useState } from 'react';
import { ArrowLeft, Plus, X, AlertCircle, HelpCircle, Calendar, Clock } from 'lucide-react';
import { MintSettings } from '../../pages/LaunchPage';

interface MintSettingsFormProps {
  onSubmit: (settings: MintSettings) => void;
  onBack: () => void;
}

export default function MintSettingsForm({ onSubmit, onBack }: MintSettingsFormProps) {
  const [formData, setFormData] = useState({
    price_sui: 10,
    start_time: '',
    duration_hours: 24,
    mint_limit_per_address: 5,
    has_mint_limit: true,
    has_allowlist: false,
    allowlist_addresses: [''],
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: MintSettings = {
      price_sui: formData.price_sui,
      start_time: formData.start_time,
      duration_hours: formData.duration_hours,
      mint_limit_per_address: formData.has_mint_limit ? formData.mint_limit_per_address : undefined,
      has_allowlist: formData.has_allowlist,
      allowlist_addresses: formData.has_allowlist
        ? formData.allowlist_addresses.filter(addr => addr.trim() !== '')
        : undefined,
    };
    onSubmit(settings);
  };

  const addAllowlistAddress = () => {
    setFormData({
      ...formData,
      allowlist_addresses: [...formData.allowlist_addresses, ''],
    });
  };

  const removeAllowlistAddress = (index: number) => {
    setFormData({
      ...formData,
      allowlist_addresses: formData.allowlist_addresses.filter((_, i) => i !== index),
    });
  };

  const updateAllowlistAddress = (index: number, value: string) => {
    const newAddresses = [...formData.allowlist_addresses];
    newAddresses[index] = value;
    setFormData({ ...formData, allowlist_addresses: newAddresses });
  };

  const tooltips = {
    price: 'The price in SUI that minters will pay for each NFT. Set to 0 for a free mint.',
    gas: 'Important: The minter/buyer will pay network gas fees in addition to the mint price you set here.',
    start_time: 'The date and time when your mint will begin. You can schedule it for the future or start immediately.',
    duration: 'How long the mint will remain active. After this time, no new mints will be possible.',
    mint_limit: 'Maximum number of NFTs each wallet address can mint. Leave empty for no limit.',
    allowlist: 'A whitelist of wallet addresses that can mint before or during the public sale.',
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

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Mint Settings</h2>
          <p className="text-slate-400">Configure pricing, timing, and access control</p>
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Mint Price (SUI) *
            <Tooltip field="price" text={tooltips.price} />
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={formData.price_sui}
              onChange={(e) => setFormData({ ...formData, price_sui: parseFloat(e.target.value) })}
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            <div className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-semibold">
              SUI
            </div>
          </div>
          <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-200">
              <Tooltip field="gas" text={tooltips.gas} />
              <strong>Gas Fees:</strong> The minter will pay network gas fees in addition to the {formData.price_sui} SUI mint price.
              Estimated total cost: ~{(formData.price_sui + 0.002).toFixed(3)} SUI per mint.
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Time *
              <Tooltip field="start_time" text={tooltips.start_time} />
            </label>
            <input
              type="datetime-local"
              required
              min={minDateTime}
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration (Hours) *
              <Tooltip field="duration" text={tooltips.duration} />
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration_hours}
              onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.has_mint_limit}
                onChange={(e) => setFormData({ ...formData, has_mint_limit: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 focus:ring-2 bg-slate-700"
              />
              <span className="text-sm font-semibold text-white">
                Set Mint Limit Per Address
                <Tooltip field="mint_limit" text={tooltips.mint_limit} />
              </span>
            </label>
          </div>

          {formData.has_mint_limit && (
            <input
              type="number"
              min="1"
              value={formData.mint_limit_per_address}
              onChange={(e) => setFormData({ ...formData, mint_limit_per_address: parseInt(e.target.value) })}
              placeholder="e.g., 5"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          )}
        </div>

        <div className="pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.has_allowlist}
                onChange={(e) => setFormData({ ...formData, has_allowlist: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 focus:ring-2 bg-slate-700"
              />
              <span className="text-sm font-semibold text-white">
                Enable Allowlist (Whitelist)
                <Tooltip field="allowlist" text={tooltips.allowlist} />
              </span>
            </label>
            {formData.has_allowlist && (
              <button
                type="button"
                onClick={addAllowlistAddress}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            )}
          </div>

          {formData.has_allowlist && (
            <div className="space-y-3">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-sm text-cyan-200">
                Add wallet addresses that are allowed to mint. You can paste multiple addresses.
              </div>
              {formData.allowlist_addresses.map((address, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => updateAllowlistAddress(index, e.target.value)}
                    placeholder="0x1234...abcd or wallet address"
                    className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                  />
                  {formData.allowlist_addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAllowlistAddress(index)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Review & Launch
        </button>
      </div>
    </form>
  );
}
