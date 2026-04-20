import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { instructorProfileSchema, InstructorProfileFormData } from '../validation';
import { Upload, X, Camera, User, BookOpen, Briefcase, Building2, Calendar, Mail, Phone, Globe, Facebook, MessageCircle, Smartphone } from 'lucide-react';

interface InstructorFormProps {
  user: any;
  instructor: any;
  onSubmit: (data: InstructorProfileFormData & { image?: File }) => void;
  onCancel: () => void;
  imagePreview?: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

export function InstructorForm({
  user,
  instructor,
  onSubmit,
  onCancel,
  imagePreview,
  onImageChange,
  onImageRemove
}: InstructorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstructorProfileFormData>({
    resolver: zodResolver(instructorProfileSchema),
    values: {
      name: instructor?.name || user?.name || '',
      email: instructor?.email || user?.email || '',
      gender: instructor?.gender || '',
      qualification: instructor?.qualification || '',
      experience: instructor?.experience || '',
      designation: instructor?.designation || '',
      department: instructor?.department || '',
      business_name: instructor?.business_name || '',
      date_of_birth: instructor?.date_of_birth || '',
      website: instructor?.website || '',
      facebook: instructor?.facebook || '',
      telegram: instructor?.telegram || '',
      whatsapp: instructor?.whatsapp || '',
      mobile: instructor?.mobile || (user?.mobile ? String(user.mobile) : ''),
      joining_date: instructor?.joining_date || '',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-primary-light overflow-hidden bg-gray-50 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : instructor?.image ? (
                <img src={`https://admin.goldenlifeltd.com/uploads/instructor/image/${instructor.image}`} alt="Current profile" className="w-full h-full object-cover" />
              ) : (
                <Upload size={40} className="text-gray-400" />
              )}
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <label className="cursor-pointer inline-block">
              <div className="px-6 py-3 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                Choose Image
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <p className="mt-2 text-sm text-gray-500">JPG, PNG or WEBP. Max size 2MB.</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20 flex items-center gap-2">
          <User className="text-primary-light" size={20} /> Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input type="text" {...register('name')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="Enter your full name" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
            <input type="email" {...register('email')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="example@email.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
            <input type="tel" {...register('mobile')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="01XXXXXXXXX" />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
            <select {...register('gender')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
            <input type="date" {...register('date_of_birth')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" />
            {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth.message}</p>}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20 flex items-center gap-2">
          <BookOpen className="text-secondary" size={20} /> Professional Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification *</label>
            <input type="text" {...register('qualification')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="e.g. MSc in CSE" />
            {errors.qualification && <p className="mt-1 text-xs text-red-500">{errors.qualification.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience *</label>
            <input type="text" {...register('experience')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="e.g. 5 Years" />
            {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Designation *</label>
            <input type="text" {...register('designation')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="e.g. Senior Lecturer" />
            {errors.designation && <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
            <input type="text" {...register('department')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="e.g. Computer Science" />
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business/Academy Name *</label>
            <input type="text" {...register('business_name')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="e.g. Tech Academy" />
            {errors.business_name && <p className="mt-1 text-xs text-red-500">{errors.business_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date *</label>
            <input type="date" {...register('joining_date')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" />
            {errors.joining_date && <p className="mt-1 text-xs text-red-500">{errors.joining_date.message}</p>}
          </div>
        </div>
      </div>

      {/* Online Presence */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20 flex items-center gap-2">
          <Globe className="text-indigo-500" size={20} /> Online Presence
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
            <input type="url" {...register('website')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="https://..." />
            {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Profile</label>
            <input type="url" {...register('facebook')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="https://facebook.com/..." />
            {errors.facebook && <p className="mt-1 text-xs text-red-500">{errors.facebook.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telegram Username</label>
            <input type="text" {...register('telegram')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="@username" />
            {errors.telegram && <p className="mt-1 text-xs text-red-500">{errors.telegram.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
            <input type="tel" {...register('whatsapp')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light outline-none" placeholder="01XXXXXXXXX" />
            {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none px-12 py-4 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary-light/30 hover:shadow-primary-dark/30 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} className="px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all duration-300">
          Cancel
        </button>
      </div>
    </form>
  );
}
