import { MapPin, Mail, Trash2, Pen, Edit2, Loader2 } from 'lucide-react';
import { getFallbackImage } from '@/utils/imageHelpers';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ProfileHeaderProps {
  name: string;
  email: string;
  sellerId?: string;
  imageUrl?: string;
  coverGradient?: string;
  vendorId?: number;
  onEditToggle?: () => void;
}

export function ProfileHeader({
  name,
  email,
  sellerId,
  imageUrl,
  coverGradient = 'from-primary-light/20 via-primary-dark/20 to-primary-light/10',
  onEditToggle
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const getVendorToken = () => {
    const session = sessionStorage.getItem('vendor_session');
    return session ? JSON.parse(session).token : null;
  };

  const displayImageUrl = imageError ? getFallbackImage('vendor') : (imageUrl || getFallbackImage('vendor'));
  const displayName = name || 'User';
  const displayEmail = email || '';
  const displaySellerId = sellerId || '';

  const fetchBanner = async () => {
    try {
      const token = getVendorToken();
      if (!token) return;

      const response = await axios.get(`${baseURL}/api/vendor/banner`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.banner) {
        setBanner(response.data.banner);
      }
    } catch (error) {
      console.error('Failed to fetch banner:', error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleBannerUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP formats are allowed');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const token = getVendorToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.post(`${baseURL}/api/vendor/banner`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.vendor?.banner) {
        setBanner(response.data.vendor.banner);
        toast.success('Banner uploaded successfully!');
      } else {
        await fetchBanner();
        toast.success('Banner uploaded successfully!');
      }
    } catch (error: any) {
      console.error('Banner upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleBannerDelete = async () => {
    try {
      setDeleting(true);
      const token = getVendorToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete(`${baseURL}/api/vendor/banner`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBanner(null);
      setShowDeleteConfirm(false);
      toast.success('Banner removed successfully!');
    } catch (error: any) {
      console.error('Banner delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete banner');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBannerUpload(file);
    }
  };

  const hasBanner = !!banner;
  const bannerUrl = banner ? `${baseURL}/uploads/vendor/banner/${banner}` : undefined;

  // ✅ Scroll to edit form function
  const handleEditClick = () => {
    if (onEditToggle) {
      onEditToggle(); // Enable edit mode
      // Smooth scroll to edit form
      setTimeout(() => {
        const editForm = document.getElementById('edit-profile-form');
        if (editForm) {
          editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="relative mb-6">
      {/* Cover Banner */}
      <div className="relative h-32 md:h-40 rounded-t-2xl overflow-hidden group">
        {hasBanner ? (
          <img
            src={bannerUrl}
            alt="Cover Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`h-full bg-gradient-to-br ${coverGradient}`} />
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <label className="absolute bottom-3 right-3 cursor-pointer bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all z-10">
          <Pen className="w-4 h-4 text-white" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Cover Photo?</h3>
              <p className="text-gray-600">Are you sure you want to remove your cover photo? This action cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBannerDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6 -mt-12 md:-mt-16">
        <div className="mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">

            {/* Avatar - Camera icon removed, only image */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={displayImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>

            {/* NAME, SELLER ID, EMAIL, ADDRESS */}
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {displayName}
              </h1>

              {displaySellerId && (
                <p className="text-sm text-gray-600">
                  Seller ID: {displaySellerId}
                </p>
              )}

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-primary-light flex-shrink-0" />
                  <span>{displayEmail}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary-light flex-shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              {/* ✅ Edit Profile Button - replaces camera icon */}
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-white border-2 border-primary-light text-primary-light font-bold rounded-xl hover:bg-primary-light hover:text-white transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-white border-2 border-primary-light text-primary-light font-bold rounded-xl hover:bg-primary-light hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
                Share Profile
              </button>
              <button className="px-4 py-2 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-light/30 hover:shadow-primary-dark/30">
                View Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}