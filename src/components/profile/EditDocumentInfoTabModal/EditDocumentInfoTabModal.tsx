import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  FileText,
  Upload,
  ChevronRight,
  Info,
  Camera,
  Hash
} from 'lucide-react';
import { toast } from 'react-toastify';
import { DocumentData } from '../types/types';

interface EditDocumentInfoTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DocumentData | null;
  baseURL: string;
  token: string | null;
  onSuccess: (updatedData: DocumentData) => void;
}

export default function EditDocumentInfoTabModal({
  isOpen,
  onClose,
  data,
  baseURL,
  token,
  onSuccess
}: EditDocumentInfoTabModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nidNumber, setNidNumber] = useState('');

  const [frontPage, setFrontPage] = useState<File | null>(null);
  const [backPage, setBackPage] = useState<File | null>(null);

  const [previews, setPreviews] = useState({
    nid_front: null as string | null,
    nid_back: null as string | null,
  });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const effectiveBaseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    if (data && isOpen) {
      setNidNumber(data.nid_number || '');

      const frontUrl = data.nid_front_page
        ? `${effectiveBaseURL}/uploads/student/nid_front_page/${data.nid_front_page}`
        : null;
      const backUrl = data.nid_back_page
        ? `${effectiveBaseURL}/uploads/student/nid_back_page/${data.nid_back_page}`
        : null;

      setPreviews({ nid_front: frontUrl, nid_back: backUrl });
      setFrontPage(null);
      setBackPage(null);
    }
  }, [data, isOpen, effectiveBaseURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'front') {
        setFrontPage(file);
        setPreviews(p => ({ ...p, nid_front: url }));
      } else {
        setBackPage(file);
        setPreviews(p => ({ ...p, nid_back: url }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveStudentId = data?.student_id || data?.id?.toString();
    if (!effectiveStudentId) {
      toast.error("Student ID is missing. Cannot update.");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('student_id', effectiveStudentId);
    formDataToSend.append('nid_number', nidNumber);
    if (frontPage) formDataToSend.append('nid_front_page', frontPage);
    if (backPage) formDataToSend.append('nid_back_page', backPage);

    try {
      const response = await axios.post(
        `${effectiveBaseURL}/api/student/document-info?id=${effectiveStudentId}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );

      if (response.data?.status === "success" || response.data?.success) {
        toast.success(response.data.message || "Documents updated successfully!");
        onSuccess(response.data.data);
        onClose();
      } else {
        toast.error(response.data?.message || "Failed to update documents.");
      }
    } catch (error: any) {
      console.error('Update Error:', error.response?.data);
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
                <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Identity Records</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">Update your identification documents</p>
                </div>
              </div>
              <button onClick={onClose} disabled={isSubmitting} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto">
              {/* Verification Notice */}
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm mt-0.5">
                  <Info size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-blue-900 tracking-tight">Verification Notice</p>
                  <p className="text-[11px] leading-relaxed text-blue-700/80 font-medium">
                    Please ensure your NID number matches the image provided. Clear and readable scans speed up the verification process.
                  </p>
                </div>
              </div>

              {/* NID Number Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">National ID Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within:bg-emerald-600/10 group-focus-within:text-emerald-600 transition-all">
                    <Hash size={16} />
                  </div>
                  <input
                    type="text"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                    placeholder="Enter your NID Number"
                    required
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={16} className="text-emerald-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Identity Documents</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* NID Front */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">NID Front Page</p>
                    <div
                      className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload"
                      onClick={() => !isSubmitting && frontInputRef.current?.click()}
                    >
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
                      <input ref={frontInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'front')} />
                    </div>
                  </div>

                  {/* NID Back */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">NID Back Page</p>
                    <div
                      className="relative aspect-[3/2] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600/30 transition-all cursor-pointer overflow-hidden group/upload"
                      onClick={() => !isSubmitting && backInputRef.current?.click()}
                    >
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
                      <input ref={backInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'back')} />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Sticky Footer Submit Button — same pattern as EditNomineeInfoTabModal */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <button
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e as any)}
                className="w-full h-14 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-widest text-xs">Updating Records...</span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Save Documents</span>
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