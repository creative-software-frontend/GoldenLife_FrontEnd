// ImageUpload.tsx

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateImageFile, createImagePreview } from '../utils/helpers';

interface ImageUploadProps {
  images: File[];
  existingImages?: string[];
  onImagesChange: (files: File[]) => void;
  onExistingImagesRemove?: (index: number) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  existingImages = [],
  onImagesChange,
  onExistingImagesRemove,
  maxImages = 5,
  disabled = false
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const totalImages = images.length + existingImages.length;
  const canUploadMore = totalImages < maxImages;

  // Handle file validation and addition
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if we've reached max images
      if (totalImages + validFiles.length >= maxImages) {
        newErrors.push(`Maximum ${maxImages} images allowed`);
        break;
      }

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      validFiles.push(file);
    }

    // Add valid files
    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
    }

    // Show errors
    if (newErrors.length > 0) {
      setUploadErrors(newErrors);
      setTimeout(() => setUploadErrors([]), 5000);
    }
  }, [images, onImagesChange, maxImages, totalImages]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || !canUploadMore) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, canUploadMore, handleFiles]);

  // Handle file input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (disabled || !canUploadMore) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }

    // Reset input value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, canUploadMore, handleFiles]);

  // Remove image from new uploads
  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // Click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled && canUploadMore && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, canUploadMore]);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-300 ease-in-out
          ${dragActive
            ? 'border-primary-light bg-primary-light/10 scale-[1.02]'
            : 'border-gray-300 hover:border-primary-light/70 hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!canUploadMore ? 'bg-gray-100' : 'bg-white'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          disabled={disabled || !canUploadMore}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${canUploadMore && !disabled
              ? 'bg-primary-light/10 text-primary-light'
              : 'bg-gray-100 text-gray-400'
            }
          `}>
            <Upload size={32} strokeWidth={2} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">
              {canUploadMore && !disabled
                ? 'Click or drag images to upload'
                : `Maximum ${maxImages} images reached`
              }
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or WEBP. Max size 2MB each.
            </p>
            <p className="text-xs font-medium text-primary-light">
              {images.length + existingImages.length} / {maxImages} images uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="space-y-2">
          {uploadErrors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Image Previews */}
      {(images.length > 0 || existingImages.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Existing Images */}
          {existingImages.map((imageUrl, index) => (
            <div
              key={`existing-${index}`}
              className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200"
            >
              <img
                src={imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`}
                alt={`Existing product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

              {onExistingImagesRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExistingImagesRemove(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              )}

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                Existing
              </div>
            </div>
          ))}

          {/* New Images */}
          {images.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200"
            >
              <ImagePreview file={file} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              )}

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-md truncate max-w-[calc(100%-16px)]">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for image preview
function ImagePreview({ file }: { file: File }) {
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    createImagePreview(file)
      .then(setPreview)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [file]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon size={32} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={preview}
      alt={file.name}
      className="w-full h-full object-cover"
    />
  );
}

// Need to define baseURL for image URLs
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
