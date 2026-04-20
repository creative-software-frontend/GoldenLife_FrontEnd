import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  User,
  Calendar,
  Heart,
  ShieldCheck,
  Globe,
  MapPin,
  Activity,
  Home,
  ChevronRight,
  Info
} from 'lucide-react';
import { toast } from 'react-toastify';
import { PersonalData } from '../types/types';

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalData | null;
  baseURL: string;
  token: string | null;
  onSuccess: (updatedData: PersonalData) => void;
}

const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "text", options = [] }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
        <Icon size={18} />
      </div>
      {options.length > 0 ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none text-slate-700 font-medium"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt: any) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
        />
      )}
      {options.length > 0 && (
        <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
      )}
    </div>
  </div>
);

export default function EditPersonalInfoModal({
  isOpen,
  onClose,
  data,
  baseURL,
  token,
  onSuccess
}: EditPersonalInfoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalData>>({});

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        father_name: data.father_name || '',
        mother_name: data.mother_name || '',
        date_of_birth: data.date_of_birth || '',
        religion: data.religion || '',
        gender: data.gender || '',
        blood_group: data.blood_group || '',
        marital_status: data.marital_status || '',
        country_name: data.country_name || '',
        division: data.division || '',
        district: data.district || '',
        upazila_thana_name: data.upazila_thana_name || '',
        union_word_name: data.union_word_name || '',
        living_country: data.living_country || '',
        location: data.location || ''
      });
    }
  }, [data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.student_id) {
      toast.error("Student ID is missing. Cannot update.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/student/personal-info?id=${data.student_id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (response.data?.status === "success") {
        toast.success(response.data.message || "Personal information updated successfully!");
        onSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update information.");
      }
    } catch (error: any) {
      console.error("Update Error:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof PersonalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && onClose()}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 max-h-[85vh] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Personal Details</h3>
                <p className="text-xs text-slate-400 font-medium">Update your identification and residential info</p>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Family & Identity</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField icon={User} label="Father's Name" value={formData.father_name} onChange={(v: string) => updateField('father_name', v)} placeholder="Full name of father" />
                  <InputField icon={User} label="Mother's Name" value={formData.mother_name} onChange={(v: string) => updateField('mother_name', v)} placeholder="Full name of mother" />
                  <InputField icon={Calendar} label="Date of Birth" type="date" value={formData.date_of_birth} onChange={(v: string) => updateField('date_of_birth', v)} />
                  <InputField icon={ShieldCheck} label="Religion" value={formData.religion} onChange={(v: string) => updateField('religion', v)} placeholder="Select Religion" options={['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other']} />
                  <InputField icon={User} label="Gender" value={formData.gender} onChange={(v: string) => updateField('gender', v)} placeholder="Select Gender" options={['Male', 'Female', 'Other']} />
                  <InputField icon={Activity} label="Blood Group" value={formData.blood_group} onChange={(v: string) => updateField('blood_group', v)} placeholder="Select Group" options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                  <InputField icon={Heart} label="Marital Status" value={formData.marital_status} onChange={(v: string) => updateField('marital_status', v)} placeholder="Select Status" options={['Single', 'Married', 'Divorced', 'Widowed']} />
                  <InputField icon={Globe} label="Country Name" value={formData.country_name} onChange={(v: string) => updateField('country_name', v)} placeholder="Birth Country" />
                </div>
              </div>

              {/* Residential Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Home size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Residential Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField icon={Globe} label="Living Country" value={formData.living_country} onChange={(v: string) => updateField('living_country', v)} placeholder="Current Country" />
                  <InputField icon={MapPin} label="Division" value={formData.division} onChange={(v: string) => updateField('division', v)} placeholder="State/Division" />
                  <InputField icon={MapPin} label="District" value={formData.district} onChange={(v: string) => updateField('district', v)} placeholder="City/District" />
                  <InputField icon={MapPin} label="Upazila/Thana" value={formData.upazila_thana_name} onChange={(v: string) => updateField('upazila_thana_name', v)} placeholder="Sub-district/Area" />
                  <InputField icon={MapPin} label="Union/Ward" value={formData.union_word_name} onChange={(v: string) => updateField('union_word_name', v)} placeholder="Ward/Union name" />
                  <div className="sm:col-span-2">
                    <InputField icon={MapPin} label="Permanent Location" value={formData.location} onChange={(v: string) => updateField('location', v)} placeholder="Full address" />
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm mt-0.5">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Security Notice</p>
                  <p className="text-xs text-slate-500 font-medium">Your personal details are used for verification purposes only. Make sure to provide accurate information.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 px-6 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="animate-pulse">Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Profile</span>
                      <div className="p-1 px-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}