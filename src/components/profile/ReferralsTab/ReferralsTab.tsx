import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { baseURL } from '@/store/utils';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Loader2, Users, User, Phone, CheckCircle, XCircle } from 'lucide-react';
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
    const { data: referrals = [], isLoading, error: queryError } = useQuery({
        queryKey: ['referrals'],
        queryFn: async () => {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) {
                throw new Error("Authorization token missing.");
            }

            const response = await axios.get(`${baseURL}/api/referred-students`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Failed to fetch referred students.");
            }
        }
    });

    const error = queryError instanceof Error ? queryError.message : '';

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
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800">My Referrals</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        You have successfully referred <span className="text-emerald-600 font-bold">{referrals.length}</span> students.
                    </p>
                </div>
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
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Contact</th>
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider">Joined Date</th>
                                    <th className="pb-4 font-bold text-slate-400 uppercase text-[11px] tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {referrals.map((req, idx) => (
                                    <motion.tr 
                                        key={req.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                                    <img src={avatarUrl(req.image, req.name)} alt="profile" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 capitalize">{req.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium max-w-[150px] truncate">{req.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold font-mono">
                                                {req.affiliate_id}
                                            </div>
                                        </td>
                                        <td className="py-4 font-medium text-slate-600">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Phone size={14} className="text-slate-400"/> {req.mobile}
                                            </div>
                                        </td>
                                        <td className="py-4 font-medium text-slate-600">
                                            {format(new Date(req.created_at), 'dd MMM yyyy')}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                                                req.status.toLowerCase() === 'active' 
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
                        {referrals.map((req, idx) => (
                            <motion.div 
                                key={req.id} 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4"
                            >
                                <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                            <img src={avatarUrl(req.image, req.name)} alt="profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 capitalize leading-tight">{req.name}</p>
                                            <p className="text-xs text-slate-400 font-medium truncate max-w-[120px]">{req.email}</p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        req.status.toLowerCase() === 'active' 
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
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Contact</p>
                                        <p className="text-slate-700 font-bold flex items-center gap-1">
                                            <Phone size={12} className="text-slate-400"/> {req.mobile}
                                        </p>
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
