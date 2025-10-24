import { useState, useRef } from 'react';
import { Upload, Link, X, Image, Loader2 } from 'lucide-react';
import { uploadFileToPinata, validateFileForUpload } from '../../services/pinata';

interface MediaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (gatewayUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export default function MediaInput({
  value,
  onChange,
  placeholder = 'Enter image URL or upload file',
  accept = 'image/*',
  className = '',
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: MediaInputProps) {
  const [inputMode, setInputMode] = useState<'url' | 'file'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    console.log('📁 MediaInput: File selected:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    if (file && file.type.startsWith('image/')) {
      try {
        // Validate file
        validateFileForUpload(file);
        
        setIsLoading(true);
        setUploadProgress('Validating file...');
        onUploadStart?.();
        
        console.log('⬆️ MediaInput: Starting upload to Pinata...');
        
        // Upload to Pinata
        setUploadProgress('Uploading to IPFS...');
        const uploadResult = await uploadFileToPinata(file);
        
        console.log('✅ MediaInput: Upload successful!', {
          cid: uploadResult.cid,
          gatewayUrl: uploadResult.gatewayUrl
        });
        
        // Update with gateway URL
        onChange(uploadResult.gatewayUrl);
        setIsValidUrl(true);
        setUploadProgress('Upload complete!');
        
        onUploadComplete?.(uploadResult.gatewayUrl);
        
        // Clear progress message after a delay
        setTimeout(() => setUploadProgress(''), 2000);
        
      } catch (error) {
        console.error('❌ MediaInput: Upload failed:', {
          error: error instanceof Error ? error.message : String(error),
          fileName: file.name,
          stack: error instanceof Error ? error.stack : undefined
        });
        
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadProgress(`Error: ${errorMessage}`);
        setIsValidUrl(false);
        onUploadError?.(errorMessage);
        
        // Clear error message after a delay
        setTimeout(() => setUploadProgress(''), 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn('⚠️ MediaInput: Invalid file type:', file.type);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleUrlChange = (url: string) => {
    console.log('🔗 MediaInput: URL changed:', url);
    onChange(url);
    if (url.trim()) {
      setIsLoading(true);
      setIsValidUrl(null);
      
      console.log('🔍 MediaInput: Validating URL:', url);
      
      // Check if URL is valid by testing if it loads
      const img = document.createElement('img');
      img.onload = () => {
        console.log('✅ MediaInput: URL validation successful');
        setIsLoading(false);
        setIsValidUrl(true);
      };
      img.onerror = () => {
        console.error('❌ MediaInput: URL validation failed');
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
                <p className="text-white font-medium">Uploading to IPFS...</p>
                <p className="text-slate-400 text-sm mt-1">{uploadProgress || 'Please wait'}</p>
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
                <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF, WebP up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative mt-3 animate-fadeIn">
          <div className="relative group">
            <div className={`w-full h-64 rounded-lg overflow-hidden transition-all duration-300 ${
              isValidUrl === false ? 'ring-2 ring-red-500/50' : ''
            }`}>
              {isLoading ? (
                <div className="w-full h-full bg-slate-700 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                  <p className="text-slate-400 text-sm">Loading...</p>
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
                <div className="w-full h-full bg-red-900/20 flex flex-col items-center justify-center">
                  <Image className="w-12 h-12 text-red-400 mb-2" />
                  <p className="text-red-400 text-sm">Failed to load image</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={clearValue}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900/90 transition-all duration-300 transform hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}