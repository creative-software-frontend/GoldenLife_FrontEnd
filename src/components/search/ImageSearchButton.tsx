'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import ImageUploadModal from './ImageUploadModal';
export default function ImageSearchButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-gray-500 hover:text-primary-default transition-colors"
        aria-label="Search by image"
        title="Search by image"
      >
        <Camera size={20} />
      </button>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}