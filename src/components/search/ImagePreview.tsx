'use client';

import { X } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export default function ImagePreview({ imageUrl, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative inline-block group">
      <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
        aria-label="Remove image"
      >
        <X size={16} />
      </button>
    </div>
  );
}