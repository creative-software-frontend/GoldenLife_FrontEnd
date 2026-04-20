import { useState, useEffect } from 'react';
import {
    User, Home, MapPin, Calendar, Heart,
    Globe, Users, ShieldCheck, Activity, Loader2,
    Edit2
} from 'lucide-react';
import EditPersonalInfoModal from '../EditPersonalInfoModal.tsx/EditPersonalInfoModal';
import { useAppStore } from '@/store/useAppStore';
import { InfoCard } from '../InfoCard/InfoCard';

import { getAuthToken } from '@/store/utils';

export default function PersonalInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const internalData = useAppStore(s => s.personalInfo);
    const loading = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const token = getAuthToken();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLocalUpdate = () => {
        fetchProfile(true);
    };

    if (loading && !internalData) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading profile details...</p>
                    <p className="text-xs text-slate-400 font-medium">Fetching your personal information from our secure servers</p>
                </div>
            </div>
        );
    }

    if (!internalData) return null;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight italic">Personal Profile</h2>
                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                        <Users size={12} className="text-emerald-500" />
                        Identification & Residential Records
                    </p>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Edit Profile</span>
                </button>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Users size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Family & Identity</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={User} label="Father's Name" value={internalData.father_name} />
                        <InfoCard icon={User} label="Mother's Name" value={internalData.mother_name} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={internalData.date_of_birth} />
                        <InfoCard icon={ShieldCheck} label="Religion" value={internalData.religion} />
                        <InfoCard icon={Heart} label="Marital Status" value={internalData.marital_status} />
                        <InfoCard icon={User} label="Gender" value={internalData.gender} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Home size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={Globe} label="Living Country" value={internalData.living_country} />
                        <InfoCard icon={MapPin} label="District" value={internalData.district} />
                        <InfoCard icon={MapPin} label="Division" value={internalData.division} />
                        <InfoCard icon={MapPin} label="Upazila/Thana" value={internalData.upazila_thana_name} />
                        <InfoCard icon={MapPin} label="Union/Ward" value={internalData.union_word_name} />
                        <InfoCard icon={Activity} label="Blood Group" value={internalData.blood_group} />
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-emerald-600/20 transition-all duration-300 flex items-center gap-5 group">
                <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <MapPin size={24} />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Permanent Location:</span>
                    <span className="text-base text-slate-800 font-black tracking-tight">{internalData.location || "Not specified"}</span>
                </div>
            </div>

            <EditPersonalInfoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={internalData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}