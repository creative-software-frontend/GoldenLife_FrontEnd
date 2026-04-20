import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User,
    ShieldCheck,
    Loader2,
    TrendingUp,
    Wallet,
    Facebook,
    Youtube,
    Linkedin,
    Send,
    Twitter,
    Briefcase,
    Globe,
    Calendar,
    Heart,
    MapPin,
    Activity,
    Users
} from 'lucide-react';
import useModalStore from '@/store/modalStore';

interface DashboardStats {
    boucher_balance: number | string;
    earning_balance: number | string;
    recharge_balance: number | string;
}

const SectionHeader = ({ icon: Icon, title, badge }: any) => (
    <div className="flex flex-wrap items-center justify-between gap-y-3 mb-6 sm:mb-8 group/header">
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 sm:p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover/header:bg-emerald-600 group-hover/header:text-white group-hover/header:rotate-3 transition-all duration-500 shadow-sm shrink-0">
                <Icon size={18} />
            </div>
            <div className="space-y-0.5">
                <h3 className="font-black text-base sm:text-lg text-slate-800 tracking-tight uppercase">{title}</h3>
                <div className="h-1 w-8 bg-emerald-500 rounded-full scale-x-0 group-hover/header:scale-x-100 transition-transform origin-left duration-500" />
            </div>
        </div>
        {badge && (
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-100 shadow-inner whitespace-nowrap">
                {badge}
            </span>
        )}
    </div>
);

const InfoCard = ({ icon: Icon, label, value }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 group">
        <div className="flex items-center gap-3 sm:gap-4">
            {Icon && (
                <div className="flex-shrink-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                </div>
            )}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
        <p className="text-sm sm:text-base font-medium text-gray-800 break-all sm:break-words sm:text-right pl-11 sm:pl-0">{value || 'Not Provided'}</p>
    </div>
);

import { useAppStore } from '@/store/useAppStore';

export default function ProjectOverviewTab() {
    const student = useAppStore(s => s.studentProfile);
    const personal_info = useAppStore(s => s.personalInfo);
    const nominee_info = useAppStore(s => s.nomineeInfo);
    const additional_info = useAppStore(s => s.additionalInfo);
    const walletBalance = useAppStore(s => s.walletBalance);
    const loadingProfile = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);

    const [stats, setStats] = useState<DashboardStats>({ boucher_balance: 0, earning_balance: 0, recharge_balance: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    const profileUpdateTrigger = useModalStore((s) => s.profileUpdateTrigger);
    const profileBlobPreview = useModalStore((s) => s.profileBlobPreview);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    useEffect(() => {
        fetchProfile();

        const fetchStats = async () => {
            const session = sessionStorage.getItem("student_session");
            if (!session) {
                setLoadingStats(false);
                return;
            }
            const token = JSON.parse(session).token;
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const dashRes = await axios.get(`${baseURL}/api/student/dashboard`, { headers });
                if (dashRes?.data?.success) {
                    setStats({
                        boucher_balance: dashRes.data.data.boucher_balance || 0,
                        earning_balance: dashRes.data.data.earning_balance || 0,
                        recharge_balance: dashRes.data.data.recharge_balance || 0
                    });
                }
            } catch (err) {
                console.error("ProjectOverview: Stats Fetch failed", err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [baseURL, profileUpdateTrigger, fetchProfile]);

    if ((loadingProfile && !student) || loadingStats) {
        return (
            <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-slate-500 font-bold animate-pulse">Assembling premium dashboard view...</p>
            </div>
        );
    }

    if (!student) return null;

    const profileImg = student?.image
        ? (student.image.startsWith('http') ? student.image : `${baseURL}/uploads/student/image/${student.image}?t=${profileUpdateTrigger}_${Date.now()}`)
        : null;
    const avatarUrl = profileBlobPreview ?? profileImg ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)' }}>

                {/* Decorative ambient orbs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #10b98166 0%, transparent 70%)' }} />
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f166 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-0">

                    {/* ── Left: Avatar + Greeting ── */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-5 p-5 sm:p-10">
                        {/* Avatar with glow ring */}
                        <div className="relative shrink-0 group">
                            <div className="absolute -inset-1 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-500/60 via-teal-400/30 to-transparent blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src={avatarUrl}
                                alt={student.name}
                                className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] object-cover ring-2 ring-white/10 shadow-2xl"
                            />
                            <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-xl border-[3px] border-[#0f172a] shadow-lg shadow-emerald-500/40">
                                <ShieldCheck size={14} className="text-white" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-center sm:text-left space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400/80">Dashboard Overview</p>
                            <h2 className="text-2xl sm:text-[2.75rem] font-black tracking-tight text-white leading-[1.1] capitalize">
                                Hello, {student.name}
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xs">
                                Welcome back to your project command center.
                            </p>
                        </div>
                    </div>

                    {/* ── Vertical Divider ── */}
                    <div className="hidden lg:block w-px self-stretch my-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)' }} />

                    {/* ── Right: 3 Rows — Badges / Wallet / Affiliate ── */}
                    <div className="w-full lg:w-auto flex flex-col items-stretch divide-y divide-white/5 border-t lg:border-t-0 border-white/5">
                        {/* Row 1 — Badges */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 px-4 sm:px-10 py-4 lg:py-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary-light backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Official Student
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest backdrop-blur-sm ${student.status === 'Active' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/40 bg-rose-500/10 text-rose-400'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                {student.status || 'Inactive'}
                            </span>
                        </div>
                        {/* Row 2 & 3 — Wallet + Affiliate side by side on mobile */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-white/5">
                            {/* Wallet Balance */}
                            <div className="flex flex-col justify-center px-4 sm:px-10 py-4 lg:py-6 hover:bg-white/[0.02] transition-colors">
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Wallet Balance</p>
                                <p className="text-lg sm:text-2xl font-black tracking-tight" style={{ color: '#f59e0b' }}>৳{walletBalance || '0.00'}</p>
                            </div>
                            {/* Affiliate ID */}
                            <div className="flex flex-col justify-center px-4 sm:px-10 py-4 lg:py-6 hover:bg-white/[0.02] transition-colors">
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Affiliate ID</p>
                                <p className="text-lg sm:text-2xl font-black tracking-tight truncate" style={{ color: '#34d399' }}>{student.affiliate_id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            {/* <div className="space-y-4">
                <SectionHeader icon={TrendingUp} title="Account Statistics" />
                <div className="grid grid-cols-1 gap-4">
                    <InfoCard icon={Wallet} label="Boucher Balance" value={`৳${stats?.boucher_balance || "0.00"}`} />
                    <InfoCard icon={TrendingUp} label="Total Earnings" value={`৳${stats?.earning_balance || "0.00"}`} />
                    <InfoCard icon={BadgeDollarSign} label="Recharge Total" value={`৳${stats?.recharge_balance || "0.00"}`} />
                </div>
            </div> */}

            <div className="space-y-8">
                {/* Personal & Family */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={User} title="Personal & Family" badge="Identity Proof" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={User} label="Father's Name" value={personal_info?.father_name} />
                        <InfoCard icon={User} label="Mother's Name" value={personal_info?.mother_name} />
                        <InfoCard icon={Calendar} label="Date of Birth" value={personal_info?.date_of_birth} />
                        <InfoCard icon={ShieldCheck} label="Religion" value={personal_info?.religion} />
                        <InfoCard icon={Heart} label="Marital Status" value={personal_info?.marital_status} />
                        <InfoCard icon={Activity} label="Blood Group" value={personal_info?.blood_group} />
                    </div>
                </div>

                {/* Professional & Lifestyle */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={Briefcase} title="Professional & Lifestyle" badge="Engagement" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={Briefcase} label="Profession" value={additional_info?.profession} />
                        <InfoCard icon={Wallet} label="Monthly Income" value={additional_info?.monthly_income} />
                        <InfoCard icon={Heart} label="Hobby" value={additional_info?.hobby} />
                        <InfoCard icon={TrendingUp} label="Interests" value={additional_info?.interest} />
                        <InfoCard icon={MapPin} label="Current Location" value={personal_info?.location} />
                    </div>
                </div>

                {/* Nominee details */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
                    <SectionHeader icon={ShieldCheck} title="Nominee details" badge="Verified" />
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={User} label="Nominee Name" value={nominee_info?.nominee_name} />
                        <InfoCard icon={Activity} label="Nominee Mobile" value={nominee_info?.nominee_mobile} />
                        <InfoCard icon={ShieldCheck} label="NID Number" value={nominee_info?.nominee_nid_number} />
                        <InfoCard icon={Users} label="Relation" value={nominee_info?.relation_with} />
                    </div>
                </div>

                {/* Digital Presence */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                    <SectionHeader icon={Globe} title="Digital Presence" badge="Social" />
                    <div className="flex flex-wrap gap-2">
                        {additional_info?.facebook_url && <a href={additional_info.facebook_url} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20} /></a>}
                        {additional_info?.youtube_url && <a href={additional_info.youtube_url} target="_blank" rel="noreferrer" className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Youtube size={20} /></a>}
                        {additional_info?.linkedin_url && <a href={additional_info.linkedin_url} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={20} /></a>}
                        {additional_info?.telegram && <a href={additional_info.telegram} target="_blank" rel="noreferrer" className="p-3 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all"><Send size={20} /></a>}
                        {additional_info?.x_url && <a href={additional_info.x_url} target="_blank" rel="noreferrer" className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Twitter size={20} /></a>}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Master synchronization active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
