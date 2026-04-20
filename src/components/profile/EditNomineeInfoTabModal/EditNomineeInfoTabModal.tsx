import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  User,
  Phone,
  Heart,
  FileText,
  Upload,
  ChevronRight,
  Camera
} from 'lucide-react';
import { toast } from 'react-toastify';
import { NomineeData } from '../types/types';

interface EditNomineeInfoTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NomineeData | null;
  baseURL: string;
  token: string | null;
  onSuccess: (updatedData: NomineeData) => void;
}

const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "text", options = [] }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within:bg-emerald-600/10 group-focus-within:text-emerald-600 transition-all">
        <Icon size={16} />
      </div>
      {options.length > 0 ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all appearance-none text-slate-700 font-bold"
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
          className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300"
        />
      )}
    </div>
  </div>
);

export default function EditNomineeInfoTabModal({
  isOpen,
  onClose,
  data,
  baseURL,
  token,
  onSuccess
}: EditNomineeInfoTabModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nominee_name: '',
    nominee_mobile: '',
    nominee_nid_number: '',
    relation_with: ''
  });

  const [nomineeImage, setNomineeImage] = useState<File | null>(null);
  const [nidFront, setNidFront] = useState<File | null>(null);
  const [nidBack, setNidBack] = useState<File | null>(null);

  const [previews, setPreviews] = useState({
    nominee_image: null as string | null,
    nid_front: null as string | null,
    nid_back: null as string | null
  });

  const nomineeRef = useRef<HTMLInputElement>(null);
  const nidFrontRef = useRef<HTMLInputElement>(null);
  const nidBackRef = useRef<HTMLInputElement>(null);

  const effectiveBaseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        nominee_name: data.nominee_name || '',
        nominee_mobile: data.nominee_mobile || '',
        nominee_nid_number: data.nominee_nid_number || '',
        relation_with: data.relation_with || ''
      });

      // Correct preview paths for nominee documents
      const imagePath = data.nominee_image ? `${effectiveBaseURL}/uploads/student/nominee_image/${data.nominee_image}` : null;
      const frontPath = data.nominee_nid_front_page ? `${effectiveBaseURL}/uploads/student/nominee_nid_front_page/${data.nominee_nid_front_page}` : null;
      const backPath = data.nominee_nid_back_page ? `${effectiveBaseURL}/uploads/student/nominee_nid_back_page/${data.nominee_nid_back_page}` : null;

      setPreviews({
        nominee_image: imagePath,
        nid_front: frontPath,
        nid_back: backPath
      });
      setNomineeImage(null);
      setNidFront(null);
      setNidBack(null);
    }
  }, [data, isOpen, baseURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'image') {
        setNomineeImage(file);
        setPreviews(p => ({ ...p, nominee_image: url }));
      } else if (type === 'front') {
        setNidFront(file);
        setPreviews(p => ({ ...p, nid_front: url }));
      } else {
        setNidBack(file);
        setPreviews(p => ({ ...p, nid_back: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fix: Use data.id as a fallback if student_id is missing
    const effectiveStudentId = data?.student_id || data?.id?.toString();

    if (!effectiveStudentId) {
      toast.error("Student ID missing.");
      return;
    }
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('student_id', effectiveStudentId);
    submitData.append('nominee_name', formData.nominee_name);
    submitData.append('nominee_mobile', formData.nominee_mobile);
    submitData.append('nominee_nid_number', formData.nominee_nid_number);
    submitData.append('relation_with', formData.relation_with);

    if (nomineeImage) submitData.append('nominee_image', nomineeImage);
    if (nidFront) submitData.append('nominee_nid_front_page', nidFront);
    if (nidBack) submitData.append('nominee_nid_back_page', nidBack);

    try {
      const response = await axios.post(
        `${baseURL}/api/student/nominee-info?id=${effectiveStudentId}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data?.status === "success" || response.data?.success) {
        toast.success(response.data.message || "Nominee updated successfully!");
        onSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update nominee.");
      }
    } catch (error: any) {
      console.error("Update Error:", error.response?.data);
      toast.error(error.response?.data?.message || "An error occurred.");
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
            <div className="px-6 sm:px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nominee Registry</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">Update your legal nominee & identity info</p>
                </div>
              </div>
              <button onClick={onClose} disabled={isSubmitting} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center gap-4">
                <div
                  onClick={() => !isSubmitting && nomineeRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-50">
                    {previews.nominee_image ? (
                      <img src={previews.nominee_image} className="w-full h-full object-cover" alt="Nominee" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominee Photo</p>
                <input type="file" ref={nomineeRef} className="hidden" onChange={(e) => handleFileChange(e, 'image')} accept="image/*" />
              </div>

              {/* Data Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField icon={User} label="Nominee Full Name" value={formData.nominee_name} onChange={(v: any) => setFormData({ ...formData, nominee_name: v })} placeholder="Full name" />
                  <InputField icon={Phone} label="Mobile" value={formData.nominee_mobile} onChange={(v: any) => setFormData({ ...formData, nominee_mobile: v.slice(0, 11) })} placeholder="11-digit mobile" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField icon={FileText} label="Nominee NID Number" value={formData.nominee_nid_number} onChange={(v: any) => setFormData({ ...formData, nominee_nid_number: v })} placeholder="NID Number" />
                  <InputField icon={Heart} label="Relation Profile" value={formData.relation_with} onChange={(v: any) => setFormData({ ...formData, relation_with: v })} placeholder="e.g. Spouse / Brother" options={['Father', 'Mother', 'Spouse', 'Brother', 'Sister', 'Son', 'Daughter', 'Other']} />
                </div>
              </div>

              {/* Document Scan Section */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={16} className="text-emerald-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Identity Documents</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">NID Front Page</p>
                    <div className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload" onClick={() => nidFrontRef.current?.click()}>
                      {previews.nid_front ? (
                        <>
                          <img src={previews.nid_front} className="w-full h-full object-cover" alt="Front Preview" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Upload size={24} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Upload Front</p>
                        </div>
                      )}
                      <input ref={nidFrontRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'front')} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">NID Back Page</p>
                    <div className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload" onClick={() => nidBackRef.current?.click()}>
                      {previews.nid_back ? (
                        <>
                          <img src={previews.nid_back} className="w-full h-full object-cover" alt="Back Preview" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Upload size={24} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Upload Back</p>
                        </div>
                      )}
                      <input ref={nidBackRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'back')} />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <button
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e as any)}
                className="w-full h-14 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-widest text-xs">Securing Registry...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Save Nominee Profile</span>
                    <div className="p-1 px-2 bg-white/20 rounded-lg group-hover/btn:bg-white/30 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
