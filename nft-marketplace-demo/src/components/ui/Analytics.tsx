import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react';

interface AnalyticsProps {
  floorPrice?: string;
  volume?: string;
  totalSales?: number;
  owners?: number;
  className?: string;
}

export default function Analytics({
  floorPrice = '0.00',
  volume = '0.00',
  totalSales = 0,
  owners = 0,
  className = '',
}: AnalyticsProps) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transform hover:-translate-y-1 group animate-fadeIn" style={{ animationDelay: '0ms' }}>
        <div className="flex items-center justify-between mb-2">
          <DollarSign className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-slate-400">Floor Price</span>
        </div>
        <div className="text-xl font-bold text-white transition-all duration-300 group-hover:text-cyan-100">
          {formatPrice(floorPrice)} SUI
        </div>
        <div className="flex items-center mt-2 text-xs text-green-400">
          <TrendingUp className="w-3 h-3 mr-1 animate-pulse" />
          <span>+5.2%</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transform hover:-translate-y-1 group animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-2">
          <Activity className="w-5 h-5 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-slate-400">Total Volume</span>
        </div>
        <div className="text-xl font-bold text-white transition-all duration-300 group-hover:text-purple-100">
          {formatPrice(volume)} SUI
        </div>
        <div className="flex items-center mt-2 text-xs text-green-400">
          <TrendingUp className="w-3 h-3 mr-1 animate-pulse" />
          <span>+12.8%</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transform hover:-translate-y-1 group animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-2">
          <TrendingUp className="w-5 h-5 text-green-400 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-slate-400">Total Sales</span>
        </div>
        <div className="text-xl font-bold text-white transition-all duration-300 group-hover:text-green-100">
          {formatNumber(totalSales)}
        </div>
        <div className="flex items-center mt-2 text-xs text-green-400">
          <TrendingUp className="w-3 h-3 mr-1 animate-pulse" />
          <span>+8.5%</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-900/70 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transform hover:-translate-y-1 group animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-2">
          <Users className="w-5 h-5 text-orange-400 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-slate-400">Owners</span>
        </div>
        <div className="text-xl font-bold text-white transition-all duration-300 group-hover:text-orange-100">
          {formatNumber(owners)}
        </div>
        <div className="flex items-center mt-2 text-xs text-slate-400">
          <span>{totalSales > 0 ? Math.round((owners / totalSales) * 100) : 0}% unique</span>
        </div>
      </div>
    </div>
  );
}