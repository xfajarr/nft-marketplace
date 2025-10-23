import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  suffix?: string;
  className?: string;
  disabled?: boolean;
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  placeholder = '0',
  suffix = '',
  className = '',
  disabled = false,
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Parse the input value and ensure it's within bounds
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(min, Math.min(max, parsedValue));
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    // Reset to the actual value if input is empty or invalid
    if (inputValue === '' || isNaN(parseFloat(inputValue))) {
      setInputValue(value.toString());
    } else {
      // Ensure the displayed value matches the actual value (with bounds applied)
      const parsedValue = parseFloat(inputValue);
      const clampedValue = Math.max(min, Math.min(max, parsedValue));
      setInputValue(clampedValue.toString());
      onChange(clampedValue);
    }
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="p-2 bg-slate-800 border border-slate-700 rounded-l-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-3 py-2 bg-slate-900/50 border-t border-b border-slate-700 text-white text-center placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      {suffix && (
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
          {suffix}
        </div>
      )}
      
      <button
        type="button"
        onClick={increment}
        disabled={disabled || value >= max}
        className="p-2 bg-slate-800 border border-slate-700 rounded-r-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}