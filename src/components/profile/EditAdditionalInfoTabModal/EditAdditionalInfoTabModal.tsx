import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  Sparkles,
  Facebook,
  Youtube,
  Linkedin,
  Send,
  Twitter,
  ChevronRight,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AdditionalInfoData } from '../types/types';

interface EditAdditionalInfoTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AdditionalInfoData | null;
  baseURL: string;
  token: string | null;
  onSuccess: (updatedData: AdditionalInfoData) => void;
}

const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-1.5 transition-all focus-within:translate-x-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-100 rounded-xl text-slate-400 group-focus-within:bg-emerald-50 group-focus-within:text-emerald-600 transition-all">
        <Icon size={16} />
      </div>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-16 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300 shadow-sm"
      />
    </div>
  </div>
);

export default function EditAdditionalInfoTabModal({
  isOpen,
  onClose,
  data,
  baseURL,
  token,
  onSuccess
}: EditAdditionalInfoTabModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AdditionalInfoData>>({});

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        education: data.education || '',
        profession: data.profession || '',
        monthly_income: data.monthly_income || '',
        hobby: data.hobby || '',
        interest: data.interest || '',
        lifestyle: data.lifestyle || '',
        facebook_url: data.facebook_url || '',
        youtube_url: data.youtube_url || '',
        linkedin_url: data.linkedin_url || '',
        telegram: data.telegram || '',
        x_url: data.x_url || '',
        tiktok_url: data.tiktok_url || ''
      });
    }
  }, [data, isOpen]);

  const updateField = (field: keyof AdditionalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.student_id) {
      toast.error("Student session invalid.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/student/additional-info?id=${data.student_id}`,
        { ...formData, student_id: data.student_id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data?.status === "success" || response.data?.success) {
        toast.success(response.data.message || "Profile identity updated!");
        onSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update lifestyle info.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Internal saving error.");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="px-6 sm:px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">Lifestyle Profile</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Refine your professional & social identity</p>
                </div>
              </div>
              <button onClick={onClose} disabled={isSubmitting} className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all hover:rotate-90">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Professional Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Briefcase size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Professional Life</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField icon={GraduationCap} label="Highest Qualification" value={formData.education} onChange={(v: string) => updateField('education', v)} placeholder="e.g. Master in CSE" />
                  <InputField icon={Briefcase} label="Current Profession" value={formData.profession} onChange={(v: string) => updateField('profession', v)} placeholder="e.g. Software Engineer" />
                  <InputField icon={DollarSign} label="Monthly Income" value={formData.monthly_income} onChange={(v: string) => updateField('monthly_income', v)} placeholder="Earnings" />
                </div>
              </div>

              {/* Personal Interests Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Heart size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Personal Interests</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField icon={Heart} label="Hobby" value={formData.hobby} onChange={(v: string) => updateField('hobby', v)} placeholder="e.g. Reading" />
                  <InputField icon={Sparkles} label="Interest" value={formData.interest} onChange={(v: string) => updateField('interest', v)} placeholder="e.g. Technology" />
                  <InputField icon={Globe} label="Lifestyle" value={formData.lifestyle} onChange={(v: string) => updateField('lifestyle', v)} placeholder="e.g. Active" />
                </div>
              </div>

              {/* Digital Presence Section */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Facebook size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Digital Presence</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField icon={Facebook} label="Facebook URL" value={formData.facebook_url} onChange={(v: string) => updateField('facebook_url', v)} placeholder="https://facebook.com/..." />
                  <InputField icon={Twitter} label="Twitter / X Profile" value={formData.x_url} onChange={(v: string) => updateField('x_url', v)} placeholder="https://x.com/..." />
                  <InputField icon={Youtube} label="YouTube Channel" value={formData.youtube_url} onChange={(v: string) => updateField('youtube_url', v)} placeholder="https://youtube.com/..." />
                  <InputField icon={Linkedin} label="LinkedIn Profile" value={formData.linkedin_url} onChange={(v: string) => updateField('linkedin_url', v)} placeholder="https://linkedin.com/..." />
                  <InputField icon={Send} label="Telegram Username" value={formData.telegram} onChange={(v: string) => updateField('telegram', v)} placeholder="https://t.me/..." />
                  <div className="space-y-1.5 transition-all focus-within:translate-x-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TikTok URL</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-100 rounded-xl text-slate-400 group-focus-within:bg-slate-900 group-focus-within:text-white transition-all">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                      </div>
                      <input
                        type="text"
                        value={formData.tiktok_url || ''}
                        onChange={(e) => updateField('tiktok_url', e.target.value)}
                        placeholder="https://tiktok.com/@..."
                        className="w-full pl-16 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex gap-5 pt-8 sticky bottom-0 bg-white/95 backdrop-blur-sm -mb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 px-8 border-2 border-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-5 px-8 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:grayscale"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span className="uppercase tracking-[0.2em] text-xs font-black">Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.2em] text-xs font-black">Confirm Profile</span>
                      <div className="p-1 px-2 bg-white/20 rounded-lg">
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
