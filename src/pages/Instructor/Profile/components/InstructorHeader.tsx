import { Mail, MapPin, Edit2, Loader2, Award, BookOpen } from 'lucide-react';
import { useState } from 'react';

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
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const displayImageUrl = imageError ? '/default-avatar.png' : (imageUrl?.startsWith('http') ? imageUrl : `${baseURL}/uploads/instructor/image/${imageUrl}`);
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
      <div className="relative h-32 md:h-48 rounded-t-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
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
