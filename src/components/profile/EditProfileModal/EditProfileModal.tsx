import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User as UserIcon, X, Hash, Image as ImageIcon, ChevronRight, Check, Camera, Loader2 } from 'lucide-react';
import { StudentData } from '../BasicInfoTab/BasicInfoTab';

import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';
import useModalStore from '@/store/modalStore';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: StudentData | null;
    baseURL: string;
}

interface FormDataState {
    name: string;
    email: string;
    mobile: string;
    affiliate_id: string;
    refer_code: string;
    image: File | null;
}

export default function EditProfileModal({ isOpen, onClose, student, baseURL }: EditProfileModalProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const initialFormData = React.useMemo(() => ({
        name: student?.name || '',
        email: student?.email || '',
        mobile: student?.mobile || '',
        affiliate_id: student?.affiliate_id || '',
        refer_code: student?.refer_code || '',
        image: null
    }), [student]);

    const [formData, setFormData] = useState<FormDataState>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            const imgPath = student.image?.startsWith('http')
                ? student.image
                : `${baseURL}/uploads/student/image/${student.image}`;
            setPreviewUrl(student.image ? imgPath : null);
        }
    }, [isOpen, initialFormData, student, baseURL]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student?.id) {
            toast.error("Student ID is missing. Cannot update.");
            return;
        }

        const session = sessionStorage.getItem("student_session");
        const token = session ? JSON.parse(session).token : null;
        if (!token) {
            toast.error("Session expired. Please login again.");
            return;
        }

        setIsSubmitting(true);
        const dataToSend = new FormData();
        dataToSend.append('student_id', student.id.toString());
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('mobile', formData.mobile);
        dataToSend.append('affiliate_id', formData.affiliate_id);
        dataToSend.append('refer_code', formData.refer_code);

        if (formData.image) {
            dataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.post(
                `${baseURL}/api/student/basic-info?id=${student.id}`,
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            );

            if (response.data?.status === "success" || response.data?.success) {
                toast.success(response.data.message || "Basic profile updated successfully!");

                // 1. Force refresh of all profile photos (with cache breaking)
                const { triggerProfileUpdate } = useModalStore.getState();
                triggerProfileUpdate();

                // 2. Trigger global fetch for fresh data in navbar and profile
                const { fetchNavbarData, fetchProfile } = useAppStore.getState();
                await Promise.all([
                    fetchNavbarData(true),
                    fetchProfile(true)
                ]);

                onClose();
            } else {
                toast.error(response.data?.message || "Failed to update profile photo.");
            }
        } catch (error: any) {
            console.error("Profile Photo Update Error:", error.response?.data);
            toast.error(error.response?.data?.message || "An error occurred while saving.");
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
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Basic Profile</h3>
                                <p className="text-xs text-slate-400 font-medium">Verified identity and contact methods</p>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto">
                            <div className="flex flex-col items-center pb-6 border-b border-slate-50 relative">
                                <div className="relative group/avatar">
                                    <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white bg-slate-100 shadow-xl relative transition-transform group-hover/avatar:scale-[1.02]">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon size={36} />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera size={24} className="text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Profile Avatar</p>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Recommended: Square image, max 2MB</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Info Banner */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm mt-0.5">
                                        <Check size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Security</p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Profile information is verified and can only be changed by contacting support.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* Read-Only Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-70">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="text" value={formData.name} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input type="email" value={formData.email} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                readOnly
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Affiliate ID</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input type="text" value={formData.affiliate_id} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Refer Code</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input type="text" value={formData.refer_code} readOnly className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed outline-none font-medium" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4 sticky bottom-0 bg-white">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    type="button"
                                    className="flex-[2] py-4 px-6 bg-primary text-white font-bold rounded-2xl shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_15px_40px_-10px_rgba(var(--primary-rgb),0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="animate-pulse">Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Update Photo</span>
                                            <div className="p-1 bg-white/20 rounded-lg">
                                                <ChevronRight size={16} />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}