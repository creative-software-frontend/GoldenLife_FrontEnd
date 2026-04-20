'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Link as LinkIcon, X, Search } from 'lucide-react';
import { simulateImageSearch } from '@/lib/imageSearchData';
import ImagePreview from '../shared/ImagePreview';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'upload' | 'camera' | 'url';

export default function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'user';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setUrlInput('');
  };

  const handleSearch = async () => {
    if (!imageUrl) return;

    setIsSearching(true);
    
    try {
      const results = await simulateImageSearch(imageUrl);
      
      // For now, just show an alert with results
      // In production, this would navigate to a search results page
      alert(`Found ${results.products.length} similar products!\n\nCategory: ${results.detectedCategory}\nTags: ${results.detectedTags.join(', ')}`);
      
      onClose();
    } catch (error) {
      console.error('Image search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Search by Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('upload');
              setImageUrl(null);
              setUrlInput('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Upload size={18} />
            Upload
          </button>
          <button
            onClick={() => {
              setActiveTab('camera');
              setImageUrl(null);
              setUrlInput('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'camera'
                ? 'border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Camera size={18} />
            Camera
          </button>
          <button
            onClick={() => {
              setActiveTab('url');
              setImageUrl(null);
              setUrlInput('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'border-b-2 border-yellow-500 text-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <LinkIcon size={18} />
            URL
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-yellow-600 font-medium">Drop the image here...</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium mb-1">
                    Drag & drop an image here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports: JPG, PNG, GIF, WebP
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="text-center py-8">
              <button
                onClick={handleCameraCapture}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-yellow-400 hover:bg-gray-50 transition-colors"
              >
                <Camera size={64} className="text-gray-400 mb-4" />
                <p className="text-gray-700 font-medium">Tap to take a photo</p>
                <p className="text-sm text-gray-500 mt-1">Use your camera to capture an image</p>
              </button>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <LinkIcon size={20} className="text-gray-600" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Paste a direct link to an image (must end in .jpg, .png, etc.)
              </p>
            </div>
          )}

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-6 space-y-4">
              <ImagePreview imageUrl={imageUrl} onRemove={handleRemoveImage} />
              
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search Similar Products
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
