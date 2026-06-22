import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
    LayoutDashboard, User, FileText, FileBadge, Info, ShieldCheck, UserCircle2, Facebook, Send, Twitter, Youtube, Linkedin, Users, Star, Wallet
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { baseURL } from '@/store/utils';

interface DashboardStats {
    boucher: string | number;
    earning: string | number;

    designation: string;
    starCount: number;
}

const DEFAULT_SOCIALS = {
    facebook: "https://facebook.com",
    telegram: "https://t.me",
    twitter: "https://x.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
    tiktok: "https://tiktok.com"
};

const SocialIcon = ({ icon: Icon, url, fallbackUrl, color }: { icon: any, url: string | null | undefined, fallbackUrl: string, color: string }) => {
    return (
        <a
            href={url || fallbackUrl}
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

    const { data: shareData, isLoading: isShareLoading } = useQuery({
        queryKey: ['myShareDetails'],
        queryFn: async () => {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) throw new Error("No token found");

            try {
                const response = await axios.get(`${baseURL}/api/my-share-details`, {
                    headers: { 'X-Auth-Token': `Bearer ${token}` }
                });

                if (response.data?.success) {
                    return response.data.data;
                }
            } catch (error) {
                // Silently handle the error (likely 404/403 for non-shareholders)
                return null;
            }
            return null;
        },
        staleTime: 1000 * 60 * 5,
    });

    const getTargetArea = (hierarchy: any) => {
        if (!hierarchy) return null;
        if (hierarchy.union) return `${hierarchy.union.name} / ${hierarchy.union.bn_name}`;
        if (hierarchy.upazila) return `${hierarchy.upazila.name} / ${hierarchy.upazila.bn_name}`;
        if (hierarchy.district) return `${hierarchy.district.name} / ${hierarchy.district.bn_name}`;
        if (hierarchy.division) return `${hierarchy.division.name} / ${hierarchy.division.bn_name}`;
        return null;
    };

    // TanStack Query configured with case-insensitive payload parsing and automatic UI propagation
    const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['studentDashboardStats'],
        queryFn: async () => {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) throw new Error("No token found");

            const dashboardRes = await axios.get(`${baseURL}/api/student/dashboard`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });

            let designation = "";
            let starCount = 0;
            let boucher = 0;
            let earning = 0;

            if (dashboardRes.data?.success) {
                const data = dashboardRes.data.data;

                // Case-insensitive helper function to protect against server payload changes
                const findCaseInsensitiveKey = (obj: any, targetKey: string) => {
                    if (!obj) return null;
                    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
                    return foundKey ? obj[foundKey] : null;
                };

                // Extract Designation (Checks share_info.designation or root designation with any casing)
                const shareInfo = findCaseInsensitiveKey(data, 'share_info');
                designation = findCaseInsensitiveKey(shareInfo, 'designation') || findCaseInsensitiveKey(data, 'designation') || "";

                // Parse unicode star strings safely
                const starsString = findCaseInsensitiveKey(data, 'stars');
                if (starsString && typeof starsString === 'string') {
                    starCount = (starsString.match(/★/g) || []).length;
                } else {
                    starCount = Number(findCaseInsensitiveKey(data, 'star_count') || findCaseInsensitiveKey(data, 'star') || 0);
                }

                boucher = findCaseInsensitiveKey(data, 'boucher_balance') || data?.boucher || 0;
                earning = findCaseInsensitiveKey(data, 'earning_balance') || data?.earning || 0;
                recharge = findCaseInsensitiveKey(data, 'recharge_balance') || data?.recharge || 0;
            }

            // Fallback secondary endpoint check
            try {
                const referredRes = await axios.get(`${baseURL}/api/referred-students`, {
                    headers: { 'X-Auth-Token': `Bearer ${token}` }
                });
                if (referredRes.data?.success) {
                    const rData = referredRes.data;
                    const secondaryStars = Number(rData?.star_count || rData?.star || rData?.Star || 0);
                    if (secondaryStars) {
                        starCount = secondaryStars;
                    }
                }
            } catch (err) {
                console.error("Referred query optional sync bypassed:", err);
            }

            return { boucher, earning, recharge, designation, starCount };
        },
        placeholderData: {
            boucher: 0,
            earning: 0,
            recharge: 0,
            designation: "",
            starCount: 0
        },
        staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
    });

    // Fallbacks point directly to Zustand store properties or default data blocks instead of localStorage
    const { data: referralResponse } = useQuery({ queryKey: ['referrals'] });
    const currentDesignation = shareData?.designation || dashboardData?.designation || studentProfile?.designation || "";
    const currentStarCount = referralResponse?.star_count || dashboardData?.starCount || studentProfile?.star_count || 0;
    const combinedLoading = isProfileLoading || isDashboardLoading;

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
        { path: 'ShareDetails', label: 'ShareDetails', icon: Users },
        { path: 'referrals', label: 'Refer', icon: Users },


    ];

    return (
        <div className="w-full lg:w-80 bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 shrink-0 h-fit lg:sticky lg:top-24">
            <div className="flex flex-col items-center pb-6 border-b border-slate-50">
                <div className="relative mb-4 group">
                    {!combinedLoading && (
                        <div className="absolute inset-0 bg-primary/20 rounded-full scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    )}

                    <div className="relative w-28 h-28 rounded-full p-1.5 bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
                        {combinedLoading ? (
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
                                <div className="absolute bottom-2 right-4 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm z-20" />
                            </>
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2 w-full flex flex-col items-center">
                    {combinedLoading ? (
                        <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse mb-1" />
                    ) : (
                        <>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight capitalize">
                                {studentProfile?.name || "Student"}
                            </h3>

                            {(currentDesignation || currentStarCount > 0) && (
                                <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                                    {currentDesignation && (
                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-100 uppercase tracking-wider">
                                            {currentDesignation}
                                        </span>
                                    )}
                                    {currentStarCount > 0 && (
                                        <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100 text-xs font-black">
                                            {Array.from({ length: currentStarCount }).map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <SocialIcon icon={Facebook} url={additionalInfo?.facebook_url} fallbackUrl={DEFAULT_SOCIALS.facebook} color="#1877F2" />
                <SocialIcon icon={Send} url={additionalInfo?.telegram} fallbackUrl={DEFAULT_SOCIALS.telegram} color="#26A5E4" />
                <SocialIcon icon={Twitter} url={additionalInfo?.x_url} fallbackUrl={DEFAULT_SOCIALS.twitter} color="#1DA1F2" />
                <SocialIcon icon={Youtube} url={additionalInfo?.youtube_url} fallbackUrl={DEFAULT_SOCIALS.youtube} color="#FF0000" />
                <SocialIcon icon={Linkedin} url={additionalInfo?.linkedin_url} fallbackUrl={DEFAULT_SOCIALS.linkedin} color="#0A66C2" />

                <a
                    href={additionalInfo?.tiktok_url || DEFAULT_SOCIALS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-xl shadow-sm bg-slate-900 text-white transition-all hover:-translate-y-1 hover:shadow-md"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                </a>
            </div>

            <div className="grid grid-cols-3 gap-0 w-full mt-8 pt-6 border-t border-slate-50 text-center">
                <div className="space-y-1.5 border-r border-slate-100">
                    <p className="text-sm font-black text-slate-800">{dashboardData?.boucher ?? 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Boucher</p>
                </div>
                <div className="space-y-1.5 border-r border-slate-100">
                    <p className="text-sm font-black text-slate-800">{walletBalance ?? dashboardData?.earning ?? 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Earning</p>
                </div>

                <div className="space-y-1.5">
                    <div className="text-sm font-black text-slate-800 flex justify-center items-center h-5">
                        {isShareLoading ? (
                            <div className="h-4 w-10 bg-slate-200 rounded animate-pulse" />
                        ) : shareData?.amount_paid ? (
                            <span>{Number(shareData.amount_paid)}</span>
                        ) : (
                            <span>0</span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Share Value</p>
                </div>
            </div>

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