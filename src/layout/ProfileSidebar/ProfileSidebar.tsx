import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
    LayoutDashboard, User, FileText, FileBadge, Info, ShieldCheck, UserCircle2, Facebook, Send, Twitter, Youtube, Linkedin, Users
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { baseURL } from '@/store/utils';

interface DashboardStats {
    boucher: string | number;
    earning: string | number;
    recharge: string | number;
}

const SocialIcon = ({ icon: Icon, url, color }: { icon: any, url: string | null, color: string }) => {
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: color, color: 'white' }}
        >
            <Icon size={16} strokeWidth={2.5} />
        </a>
    );
};

export default function ProfileSidebar() {
    const studentProfile = useAppStore(s => s.studentProfile);
    const additionalInfo = useAppStore(s => s.additionalInfo);
    const walletBalance = useAppStore(s => s.walletBalance);
    const isProfileLoading = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);
    const fetchWallet = useAppStore(s => s.fetchWallet);

    const [stats, setStats] = useState<DashboardStats>({ boucher: 0, earning: 0, recharge: 0 });

    useEffect(() => {
        // Initial fetch
        fetchProfile();
        fetchWallet();

        // Fetch local-only stats (keep this for now if it's not in store yet, or move to store)
        const fetchLocalStats = async () => {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) return;

            try {
                const dashboardRes = await axios.get(`${baseURL}/api/student/dashboard`, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });

                if (dashboardRes.data?.success) {
                    const data = dashboardRes.data.data;
                    setStats({
                        boucher: data.boucher_balance || 0,
                        earning: data.earning_balance || 0,
                        recharge: data.recharge_balance || 0
                    });
                }
            } catch (err) {
                console.error('ProfileSidebar: Local data fetch failed:', err);
            }
        };

        fetchLocalStats();
    }, [fetchProfile, fetchWallet]);


    // Avatar Logic
    const cacheBreaker = Date.now();
    const avatarUrl = studentProfile?.image
        ? (studentProfile.image.startsWith('http') ? studentProfile.image : `${baseURL}/uploads/student/image/${studentProfile.image}?t=${cacheBreaker}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;

    const links = [
        { path: 'project-overview-info', label: 'Project Overview', icon: LayoutDashboard },
        { path: 'basic-info', label: 'Basic Information', icon: User },
        { path: 'personal-info', label: 'Personal Information', icon: FileText },
        { path: 'document-info', label: 'Document Information', icon: FileBadge },
        { path: 'nominee-info', label: 'Nominee Information', icon: UserCircle2 },
        { path: 'Additional-info', label: 'Additional Information', icon: Info },
        { path: 'Change-passward', label: 'Change Password', icon: ShieldCheck },
        { path: 'referrals', label: 'Refer', icon: Users },
    ];

    return (
        <div className="w-full lg:w-80 bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 shrink-0 h-fit lg:sticky lg:top-24">
            {/* Header section with photo and name */}
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
                <div className="relative mb-4 group">
                    {/* Shimmer Effect Background - Only active when not loading or on hover */}
                    {/* Shimmer Effect Background - Only active when not loading or on hover */}
                    {!isProfileLoading && (
                        <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    )}

                    <div className="relative w-28 h-28 rounded-full p-1.5 bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
                        {isProfileLoading ? (
                            /* Avatar Skeleton */
                            <div className="w-full h-full rounded-full bg-slate-200 animate-pulse" />
                        ) : (
                            <>
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover z-10 shadow-inner"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'S')}&background=FF8A00&color=fff&bold=true`;
                                    }}
                                />
                                {/* Status indicator - Only show when data is ready */}
                                <div className="absolute bottom-2 right-4 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm z-20" />
                            </>
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2 w-full flex flex-col items-center">
                    {isProfileLoading ? (
                        <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse mb-1" />
                    ) : (
                        <h3 className="font-black text-xl text-slate-800 tracking-tight capitalize">
                            {studentProfile?.name || "Student"}
                        </h3>
                    )}
                </div>
            </div>
            {/* Social Icons - UI like requested */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <SocialIcon icon={Facebook} url={additionalInfo?.facebook_url || null} color="#1877F2" />
                <SocialIcon icon={Send} url={additionalInfo?.telegram || null} color="#26A5E4" />
                <SocialIcon icon={Twitter} url={additionalInfo?.x_url || null} color="#1DA1F2" />
                <SocialIcon icon={Youtube} url={additionalInfo?.youtube_url || null} color="#FF0000" />
                <SocialIcon icon={Linkedin} url={additionalInfo?.linkedin_url || null} color="#0A66C2" />
                {additionalInfo?.tiktok_url && (
                    <a
                        href={additionalInfo.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm bg-slate-900 text-white transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                    </a>
                )}
            </div>

            {/* Stats row - UI like requested */}
            <div className="grid grid-cols-3 gap-0 w-full mt-8 pt-6 border-t border-slate-50 text-center">
                <div className="space-y-1.5 border-r border-slate-100">
                    <p className="text-sm font-black text-slate-800">{stats.boucher}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Boucher</p>
                </div>
                <div className="space-y-1.5 border-r border-slate-100">
                    <p className="text-sm font-black text-slate-800">{walletBalance}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Earning</p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-sm font-black text-slate-800">{stats.recharge}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Recharge</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5 mt-6 px-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-bold relative overflow-hidden ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" />
                                    )}
                                    <Icon
                                        size={20}
                                        className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-300 group-hover:text-primary group-hover:scale-110'
                                            }`}
                                    />
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}