import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductGalleryUrl, handleImageError } from '@/utils/imageHelpers';

interface ProductGalleryProps {
  mainImage: string;
  galleryImages?: string[];
  productTitle: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  mainImage,
  galleryImages = [],
  productTitle,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState(mainImage);

  // Combine main image with gallery images
  const allImages = [mainImage, ...galleryImages].filter(Boolean);

  const openLightbox = (imageUrl: string, index: number) => {
    setCurrentImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedImageIndex === null) return;
    
    let newIndex: number;
    if (direction === 'next') {
      newIndex = (selectedImageIndex + 1) % allImages.length;
    } else {
      newIndex = (selectedImageIndex - 1 + allImages.length) % allImages.length;
    }
    
    setSelectedImageIndex(newIndex);
    setCurrentImage(allImages[newIndex]);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted group">
        <img
          src={getProductGalleryUrl(currentImage)}
          alt={productTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => handleImageError(e, 'gallery')}
        />
        
        {/* Expand Button Overlay */}
        {allImages.length > 1 && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openLightbox(currentImage, 0)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(image, index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200
                ${currentImage === image 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <img
                src={getProductGalleryUrl(image)}
                alt={`${productTitle} ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => handleImageError(e, 'gallery')}
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {allImages.length > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{allImages.length} images</span>
          <span>Click to expand</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-200">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/20"
            onClick={() => navigateImage('prev')}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/20"
            onClick={() => navigateImage('next')}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image */}
          <div className="max-w-4xl max-h-[80vh] p-4">
            <img
              src={getProductGalleryUrl(currentImage)}
              alt={productTitle}
              className="max-h-[70vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => handleImageError(e, 'gallery')}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};
