import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Briefcase,
    GraduationCap,
    Heart,
    DollarSign,
    Sparkles,
    Edit2,
    Loader2,
    Facebook,
    Youtube,
    Linkedin,
    Send,
    Twitter,

    Monitor,
    Zap,
    Camera,
    Share2
} from 'lucide-react';
import EditAdditionalInfoTabModal from '../EditAdditionalInfoTabModal/EditAdditionalInfoTabModal';
import { AdditionalInfoData } from '../types/types';
import { InfoCard } from '../InfoCard/InfoCard';

const SocialLink = ({ icon: Icon, label, url, color }: { icon: any, label: string, url: string | null, color: string }) => (
    <a
        href={url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 transition-all group ${url ? 'opacity-100 cursor-pointer hover:shadow-lg' : 'opacity-40 cursor-not-allowed grayscale'}`}
        style={{ '--hover-bg': color } as any}
        onMouseEnter={(e) => url && (e.currentTarget.style.backgroundColor = color)}
        onMouseLeave={(e) => url && (e.currentTarget.style.backgroundColor = 'transparent')}
        onClick={(e) => !url && e.preventDefault()}
    >
        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white/20 transition-colors" style={{ color: url ? color : '#94a3b8' }}>
            <Icon size={18} className="group-hover:text-white transition-colors" />
        </div>
        <span className="text-xs font-bold text-slate-600 group-hover:text-white transition-colors">{label}</span>
    </a>
);

import { useAppStore } from '@/store/useAppStore';
import { getAuthToken } from '@/store/utils';

export default function AdditionalInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const infoData = useAppStore(s => s.additionalInfo);
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

    if (loading && !infoData) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading profile details...</p>
                    <p className="text-xs text-slate-400 font-medium">Fetching your lifestyle and social information</p>
                </div>
            </div>
        );
    }

    if (!infoData) return null;



    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight italic">Lifestyle & Socials</h2>
                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} className="text-emerald-500" />
                        Professional & Digital Identity Overview
                    </p>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Update Profile</span>
                </button>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Professional & Education */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Monitor size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth & Profession</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={GraduationCap} label="Academic Education" value={infoData.education} />
                        <InfoCard icon={Briefcase} label="Current Profession" value={infoData.profession} />
                        <InfoCard icon={DollarSign} label="Monthly Income Bracket" value={infoData.monthly_income} />
                    </div>
                </div>

                {/* Lifestyle & Content */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <Zap size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifestyle & Interest</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={Heart} label="Personal Hobby" value={infoData.hobby} />
                        <InfoCard icon={Sparkles} label="Area of Interest" value={infoData.interest} />
                        <InfoCard icon={Camera} label="Lifestyle Profile" value={infoData.lifestyle} />
                    </div>
                </div>
            </div>

            {/* Social Connect */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 ml-1">
                    <Share2 size={16} className="text-emerald-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Network Connectivity</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SocialLink icon={Facebook} label="Facebook" url={infoData.facebook_url} color="#1877F2" />
                    <SocialLink icon={Twitter} label="Twitter / X" url={infoData.x_url} color="#1DA1F2" />
                    <SocialLink icon={Youtube} label="YouTube" url={infoData.youtube_url} color="#FF0000" />
                    <SocialLink icon={Linkedin} label="LinkedIn" url={infoData.linkedin_url} color="#0A66C2" />
                    <SocialLink icon={Send} label="Telegram" url={infoData.telegram} color="#26A5E4" />
                    <SocialLink
                        icon={() => (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                        )}
                        label="TikTok"
                        url={infoData.tiktok_url}
                        color="#000000"
                    />
                </div>
            </div>

            <EditAdditionalInfoTabModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={infoData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}
