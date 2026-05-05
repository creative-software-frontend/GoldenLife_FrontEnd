import { Mail, MapPin, Edit2, Loader2, Award, BookOpen, Camera } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getAuthToken = () => {
  const session = sessionStorage.getItem("instructor_session");
  if (!session) return null;
  try {
    return JSON.parse(session).token;
  } catch (e) {
    return null;
  }
};

interface InstructorHeaderProps {
  name: string;
  email: string;
  instructorId?: string;
  imageUrl?: string;
  onEditToggle?: () => void;
}

export function InstructorHeader({
  name,
  email,
  instructorId,
  imageUrl,
  onEditToggle
}: InstructorHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(Date.now());
    }, 5000); // Force-refresh image cache every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch Banner
  const { data: bannerData, dataUpdatedAt } = useQuery({
    queryKey: ['instructor-banner'],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return null;
      const { data } = await axios.get(`${baseURL}/api/instructor/banner`, {
        headers: { 'X-Auth-Token': `Bearer ${token}` }
      });
      return data?.banner || data?.image || data?.data?.banner || data?.data?.image || data;
    },
    refetchInterval: 5000, // Automatically refresh every 5 seconds
  });

  // Update Banner Mutation
  const bannerMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = getAuthToken();
      if (!token) throw new Error("Unauthorized");
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post(`${baseURL}/api/instructor/banner/update`, formData, {
        headers: {
          'X-Auth-Token': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return data;
    },
    onSuccess: (data) => {
      const isSuccess = data?.status === 'success' ||
        data?.status === true ||
        data?.success ||
        data?.instructor ||
        data?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        toast.success(data?.message || "Banner updated successfully!", { theme: "colored" });
        setRefreshKey(Date.now());
        queryClient.invalidateQueries({ queryKey: ['instructor-banner'] });
      } else {
        toast.error(data?.message || "Failed to update banner.", { theme: "colored" });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error updating banner.", { theme: "colored" });
    }
  });

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      bannerMutation.mutate(e.target.files[0]);
    }
  };

  const displayImageUrl = imageError ? '/default-avatar.png' : (imageUrl?.startsWith('http') ? imageUrl : `${baseURL}/uploads/instructor/image/${imageUrl}?t=${refreshKey}`);

  let displayBannerUrl = '';
  if (bannerData) {
    const bannerField = typeof bannerData === 'string' ? bannerData : bannerData.banner || bannerData.image || bannerData.data?.banner || bannerData.data?.image;
    if (bannerField) {
      // It could be 'instructor/banner/xyz.jpg' or just 'xyz.jpg'. Let's handle generic cases
      if (bannerField.startsWith('http')) {
        displayBannerUrl = bannerField;
      } else if (bannerField.includes('/')) {
        displayBannerUrl = `${baseURL}/${bannerField.startsWith('/') ? bannerField.slice(1) : bannerField}`;
      } else {
        displayBannerUrl = `${baseURL}/uploads/instructor/banner/${bannerField}`;
      }

      // Add cache buster to force visual update after successful upload
      if (displayBannerUrl) {
        displayBannerUrl += (displayBannerUrl.includes('?') ? '&' : '?') + `t=${refreshKey}`;
      }
    }
  }
  const displayName = name || 'Instructor';
  const displayEmail = email || '';

  const handleEditClick = () => {
    if (onEditToggle) {
      onEditToggle();
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
      <div
        className="relative h-40 md:h-64 rounded-t-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 group"
        style={displayBannerUrl ? { backgroundImage: `url(${displayBannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>

        {/* Edit Banner Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={bannerMutation.isPending}
          className="absolute top-4 right-4 p-2 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-xl text-white transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg"
          title="Update Banner Image"
        >
          {bannerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleBannerChange}
        />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6 -mt-12 md:-mt-16 flex flex-col md:flex-row items-start md:items-end gap-6">
        <div className="relative group">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white transform group-hover:scale-[1.02] transition-transform duration-300">
            <img
              src={displayImageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-2 border-white shadow-lg">
            <Award size={16} className="text-white" />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              {displayName}
            </h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full uppercase tracking-widest">
              Top Instructor
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-indigo-500" />
              <span>{displayEmail}</span>
            </div>
            {instructorId && (
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                <span>ID: {instructorId}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 ml-auto pt-4 md:pt-0">
          <button
            onClick={handleEditClick}
            className="px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
