import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '@/store/utils';
import { Loader2, Wallet, XCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShareDetailsTab() {
    const { data: shareData, isLoading, error: queryError } = useQuery({
        queryKey: ['myShareDetailsTab'],
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
                throw new Error(response.data?.message || "Failed to fetch share details");
            } catch (error: any) {
                // If the backend returns a 404 with a custom message, extract it
                if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
                throw error;
            }
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading share details...</p>
            </div>
        );
    }

    if (queryError || !shareData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <XCircle size={32} />
                </div>
                <p className="text-slate-800 font-bold mb-2">Notice</p>
                <p className="text-slate-500 font-medium text-center">
                    {queryError instanceof Error ? queryError.message : "No share details found."}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Share2 size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Share Details</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        View your share asset allocation and investment profile.
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl bg-white rounded-3xl space-y-3"
            >
                <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Share Type</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-black rounded-lg text-xs uppercase tracking-wider">
                        {shareData.share_type}
                    </span>
                </div>

                <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Designation</span>
                    <span className="text-sm font-black text-slate-800">{shareData.designation}</span>
                </div>

                <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Payment</span>
                    <span className="text-sm font-bold text-slate-800 capitalize flex items-center gap-2">
                        <Wallet size={16} className="text-slate-400" />
                        {shareData.payment_method}
                    </span>
                </div>

                {getTargetArea(shareData.location_hierarchy) && (
                    <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 rounded-2xl">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Target Area</span>
                        <span className="text-sm font-bold text-slate-800">
                            {getTargetArea(shareData.location_hierarchy)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Purchase Date & time</span>
                    <span className="text-sm font-bold text-slate-800">
                        {new Date(shareData.purchased_at).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        })}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
