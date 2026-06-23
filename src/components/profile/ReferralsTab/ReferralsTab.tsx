import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { baseURL } from '@/store/utils';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Loader2, Users, User, Phone, CheckCircle, XCircle, Star, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReferredStudent {
    id: number;
    name: string;
    email: string;
    affiliate_id: string;
    mobile: string;
    image: string | null;
    status: string;
    created_at: string;
}

export default function ReferralsTab() {
    const { t } = useTranslation("global");
    const [searchQuery, setSearchQuery] = useState('');
    const { data: referralResponse, isLoading, error: queryError } = useQuery({
        queryKey: ['referrals'],
        queryFn: async () => {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) {
                throw new Error("'X-Auth-Token' token missing.");
            }

            const response = await axios.get(`${baseURL}/api/referred-students`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });

            if (response.data && response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data?.message || "Failed to fetch referred students.");
            }
        }
    });

    const error = queryError instanceof Error ? queryError.message : '';

    const referrals: ReferredStudent[] = referralResponse?.data || [];
    const totalReferred = referralResponse?.total_referred ?? referrals.length;
    const activeReferred = referralResponse?.active_referred ?? 0;
    const discountPercentage = referralResponse?.discount_percentage ?? "0%";
    const starCount = referralResponse?.star_count ?? 0;

    const filteredReferrals = referrals.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
            r.name.toLowerCase().includes(q) ||
            (r.affiliate_id || '').toLowerCase().includes(q) ||
            (r.mobile || '').includes(q)
        );
    });

    const avatarUrl = (img: string | null, name: string) => {
        if (img) return img.startsWith('http') ? img : `${baseURL}/uploads/student/image/${img}`;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&bold=true`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your referrals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <XCircle size={32} />
                </div>
                <p className="text-slate-800 font-bold mb-2">Notice</p>
                <p className="text-slate-500 font-medium text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">My Referrals</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        You have successfully referred <span className="text-emerald-600 font-bold">{totalReferred}</span> students.
                    </p>
                </div>
            </div>

            {/* Promo Banner */}
            <div className="mb-8 p-6 bg-slate-900 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                        বাংলাদেশের সবচেয়ে বড় <span className="text-amber-400">Trading & Business Network</span>
                    </h3>
                    <p className="text-slate-400 font-medium mb-4 max-w-2xl">
                        Training & Mentorship • Nationwide Network • Leadership Opportunity
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Referred */}
                <div className="bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Referred</span>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-black text-slate-800">{totalReferred}</span>
                        <span className="text-xs text-slate-400 font-bold">students</span>
                    </div>
                </div>

                {/* Active Referred */}
                <div className="bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Referred</span>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-black text-emerald-600">{activeReferred}</span>
                        <span className="text-xs text-emerald-500 font-bold">active</span>
                    </div>
                </div>

                {/* Discount Percentage */}
                <div className="bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discount</span>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-2xl font-black text-primary">{discountPercentage}</span>
                        <span className="text-xs text-primary font-bold font-sans">off</span>
                    </div>
                </div>

                {/* Stars / Star Level */}
                <div className="bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Star Level</span>
                    <div className="flex items-center gap-1 mt-2">
                        {starCount > 0 ? (
                            <div className="flex gap-0.5">
                                {Array.from({ length: starCount }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs font-bold">No stars yet</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={16} />
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, affiliate ID, or phone…"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {referrals.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                        You haven't referred any students yet. Share your referral link to earn rewards!
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100">
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Student</th>
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Affiliate ID</th>
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Joined Date</th>
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredReferrals.length === 0 && searchQuery ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                                        No results found for &quot;{searchQuery}&quot;
                                    </td>
                                </tr>
                            ) : null}
                {filteredReferrals.map((req, idx) => (
                                    <motion.tr
                                        key={req.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    {req.image ? (
                                                        <img src={avatarUrl(req.image, req.name)} alt="profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 capitalize">{req.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                        <Phone size={11} className="text-slate-300" />{req.mobile}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold font-mono">
                                                {req.affiliate_id}
                                            </div>
                                        </td>

                                        <td className="py-4 font-medium text-slate-600">
                                            {format(new Date(req.created_at), 'dd MMM yyyy')}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${req.status.toLowerCase() === 'active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {req.status.toLowerCase() === 'active' ? <CheckCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                                                {req.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Cards */}
                    <div className="grid gap-4 md:hidden">
                        {filteredReferrals.map((req, idx) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4"
                            >
                                <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                                            {req.image ? (
                                                <img src={avatarUrl(req.image, req.name)} alt="profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 capitalize leading-tight">{req.name}</p>
                                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <Phone size={11} className="text-slate-300" />{req.mobile}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status.toLowerCase() === 'active'
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Affiliate ID</p>
                                        <p className="font-mono text-slate-700 font-bold">{req.affiliate_id}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Joined Date</p>
                                        <p className="text-slate-700 font-bold">{format(new Date(req.created_at), 'dd MMM yyyy, hh:mm a')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
