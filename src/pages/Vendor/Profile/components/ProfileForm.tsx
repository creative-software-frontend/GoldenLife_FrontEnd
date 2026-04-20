import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '../validation';
import { Upload, X, Camera } from 'lucide-react';

interface ProfileFormProps {
  user: any;
  vendor: any;
  districts: any[];
  countries: any[];
  onSubmit: (data: ProfileFormData & { image?: File }) => void;
  onCancel: () => void;
  imagePreview?: string | null;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
}

export function ProfileForm({
  user,
  vendor,
  districts,
  countries,
  onSubmit,
  onCancel,
  imagePreview,
  onImageChange,
  onImageRemove
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: (user?.mobile && user.mobile !== 'null') ? String(user.mobile).replace(/^\+880/, '') : (vendor?.mobile ? String(vendor.mobile).replace(/^\+880/, '') : ''),
      owner_name: vendor?.owner_name || '',
      businee_name: vendor?.businee_name || '',
      mobile_business: vendor?.mobile ? String(vendor.mobile).replace(/^\+880/, '') : (user?.mobile ? String(user.mobile).replace(/^\+880/, '') : ''),
      country: vendor?.country || '',
      district: vendor?.district || '',
      address: vendor?.address || '',
      website: vendor?.website || '',
      facebook: vendor?.facebook || '',
      telegram: vendor?.telegram || '',
      whatsapp: vendor?.whatsapp || '',
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);

      // Dispatch custom event for navbar/profile refresh (same as header camera icon)
      window.dispatchEvent(new CustomEvent('vendor-profile-image-upload', { detail: { file } }));
      console.log('📸 [ProfileForm] Image selected, event dispatched');
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
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : vendor?.image ? (
                <img
                  src={`https://admin.goldenlifeltd.com/uploads/vendor/image/${vendor.image}`}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={40} className="text-gray-400" />
              )}
            </div>

            {imagePreview && (
              <button
                type="button"
                onClick={onImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
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
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG or WEBP. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name')}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed outline-none"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number *
            </label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-4 py-2.5 bg-gray-200 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold text-sm">
                +880
              </span>
              <input
                type="tel"
                {...register('mobile')}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-r-xl cursor-not-allowed outline-none font-medium"
                placeholder="1XXXXXXXXX"
              />
            </div>
            {errors.mobile && (
              <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20">
          Business Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Owner Name *
            </label>
            <input
              type="text"
              {...register('owner_name')}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed outline-none"
              placeholder="Owner's full name"
            />
            {errors.owner_name && (
              <p className="mt-1 text-xs text-red-500">{errors.owner_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              {...register('businee_name')}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.businee_name ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all`}
              placeholder="Your business name"
            />
            {errors.businee_name && (
              <p className="mt-1 text-xs text-red-500">{errors.businee_name.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Mobile
            </label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-4 py-2.5 bg-gray-200 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold text-sm">
                +880
              </span>
              <input
                type="tel"
                {...register('mobile_business')}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-r-xl cursor-not-allowed outline-none font-medium"
                placeholder="1XXXXXXXXX"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20">
          Location Details
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country *
            </label>
            <select
              {...register('country')}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.country ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all`}
            >
              <option value="">Select Country</option>
              {countries && countries.length > 0 ? (
                countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))
              ) : (
                <option value="Bangladesh">Bangladesh</option>
              )}
            </select>
            {errors.country && (
              <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              District *
            </label>
            <select
              {...register('district')}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.district ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all`}
            >
              <option value="">Select District</option>
              {districts && districts.length > 0 ? (
                districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name} {district.bn_name && `(${district.bn_name})`}
                  </option>
                ))
              ) : (
                <>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </>
              )}
            </select>
            {errors.district && (
              <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Address *
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-200'
                } rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all resize-none`}
              placeholder="House, Road, Area..."
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-light/20">
          Social Media Links
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              {...register('website')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facebook Profile
            </label>
            <input
              type="url"
              {...register('facebook')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all"
              placeholder="https://facebook.com/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telegram Username
            </label>
            <input
              type="text"
              {...register('telegram')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              {...register('whatsapp')}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all"
              placeholder="+8801XXXXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-8 py-3 bg-primary-light hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary-light/30 hover:shadow-primary-dark/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}