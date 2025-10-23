import { useState, useRef } from 'react';
import { Upload, Link, X, Image, Loader2 } from 'lucide-react';

interface MediaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
}

export default function MediaInput({
  value,
  onChange,
  placeholder = 'Enter image URL or upload file',
  accept = 'image/*',
  className = '',
}: MediaInputProps) {
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsLoading(false);
        setIsValidUrl(true);
      };
      reader.onerror = () => {
        setIsLoading(false);
        setIsValidUrl(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    if (url.trim()) {
      setIsLoading(true);
      setIsValidUrl(null);
      
      // Check if URL is valid by testing if it loads
      const img = document.createElement('img');
      img.onload = () => {
        setIsLoading(false);
        setIsValidUrl(true);
      };
      img.onerror = () => {
        setIsLoading(false);
        setIsValidUrl(false);
      };
      img.src = url;
    } else {
      setIsValidUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const clearValue = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'url'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Link className="w-4 h-4" />
          <span>URL</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'file'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {inputMode === 'url' ? (
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all pr-10 ${
              isValidUrl === false
                ? 'border-red-500/50 focus:border-red-500'
                : isValidUrl === true
                  ? 'border-green-500/50 focus:border-green-500'
                  : 'border-slate-700 focus:border-cyan-500'
            }`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isLoading && (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            )}
            {value && !isLoading && (
              <button
                type="button"
                onClick={clearValue}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 transform ${
            isDragging
              ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]'
              : 'border-slate-600 hover:border-slate-500 bg-slate-900/20 hover:bg-slate-900/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          
          {isLoading ? (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">Processing image...</p>
                <p className="text-slate-400 text-sm mt-1">Please wait</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`mx-auto w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-cyan-500/20 scale-110' : ''
              }`}>
                <Upload className={`w-6 h-6 text-slate-400 transition-all duration-300 ${
                  isDragging ? 'text-cyan-400' : ''
                }`} />
              </div>
              <div>
                <p className="text-white font-medium transition-all duration-300">
                  {isDragging ? 'Drop image here' : 'Drop image here or click to upload'}
                </p>
                <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative mt-3 animate-fadeIn">
          <div className="flex items-center space-x-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:bg-slate-900/70 transition-all duration-300 group">
            <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
              isValidUrl === false ? 'ring-2 ring-red-500/50' : ''
            }`}>
              {isLoading ? (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                    setIsValidUrl(false);
                  }}
                  onLoad={() => setIsValidUrl(true)}
                />
              )}
              {isValidUrl === false && (
                <div className="w-full h-full bg-red-900/20 flex items-center justify-center">
                  <Image className="w-6 h-6 text-red-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{value}</p>
              <p className={`text-xs transition-all duration-300 ${
                isValidUrl === false
                  ? 'text-red-400'
                  : isValidUrl === true
                    ? 'text-green-400'
                    : 'text-slate-400'
              }`}>
                {isValidUrl === false
                  ? 'Invalid image URL'
                  : isValidUrl === true
                    ? 'Image loaded successfully'
                    : 'Image preview'
                }
              </p>
            </div>
            <button
              type="button"
              onClick={clearValue}
              className="p-1 text-slate-400 hover:text-red-400 transition-all duration-300 transform hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}