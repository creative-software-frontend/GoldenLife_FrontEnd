import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Share2, X, Copy, CheckCircle2, Flame, Check, Lock, Info, RotateCw, ChevronLeft, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSidebar from '../../layout/ProfileSidebar/ProfileSidebar'; // Make sure this path matches where your file is!

export default function ProfileSettings() {
    const [referralLink, setReferralLink] = useState<string>('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Check-in States
    const [checkInStatus, setCheckInStatus] = useState<any>(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    useEffect(() => {
        const fetchReferralLink = async () => {
            const session = sessionStorage.getItem("student_session");
            if (!session) return;
            try {
                const token = JSON.parse(session).token;
                const response = await axios.get(`${baseURL}/api/student/referral-link`, {
                    headers: { 'X-Auth-Token': `Bearer ${token}` }
                });
                console.log(response.data);
                if (response.data?.success) {
                    setReferralLink(response.data.data.referral_link);
                }
            } catch (error) {
                console.error('Failed to fetch referral link', error);
            }
        };

        const fetchCheckInStatus = async () => {
            const session = sessionStorage.getItem("student_session");
            if (!session) return;
            setIsRefreshing(true);
            try {
                const token = JSON.parse(session).token;
                const response = await axios.get(`${baseURL}/api/student/check-in/status`, {
                    headers: { 'X-Auth-Token': `Bearer ${token}` }
                });
                if (response.data?.success) {
                    setCheckInStatus(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch check in status', error);
            } finally {
                setIsRefreshing(false);
            }
        };

        fetchReferralLink();
        fetchCheckInStatus();
    }, [baseURL]);

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        const session = sessionStorage.getItem("student_session");
        if (!session) {
            setIsRefreshing(false);
            return;
        }
        try {
            const token = JSON.parse(session).token;
            const response = await axios.get(`${baseURL}/api/student/check-in/status`, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            if (response.data?.success) {
                setCheckInStatus(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch check in status', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleClaimCheckIn = async () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return;
        setIsClaiming(true);
        try {
            const token = JSON.parse(session).token;
            const response = await axios.post(`${baseURL}/api/student/check-in/claim`, {}, {
                headers: { 'X-Auth-Token': `Bearer ${token}` }
            });
            if (response.data?.success) {
                toast.success(response.data.message || "Successfully checked in!");
                handleManualRefresh();
            } else {
                toast.error(response.data.message || "Failed to check in.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsClaiming(false);
        }
    };

    const handleCopy = () => {
        if (!referralLink) {
            toast.error("Referral link not available");
            return;
        }
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 relative">
            {/* Max-width container to keep things centered and neat */}
            <div className="max-w-6xl mx-auto">

                {/* Header (Optional, but looks great for context) */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Manage your profile, documents, and security preferences.
                        </p>
                    </div>

                    <div className="flex gap-6 items-start sm:items-center justify-center my-6 sm:my-0">
                        {/* Daily Check-In Trigger */}
                        <div
                            onClick={() => setIsCheckInModalOpen(true)}
                            className="flex flex-col items-center cursor-pointer group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300 relative"
                            >
                                <Flame size={28} />
                                {checkInStatus && !checkInStatus.is_claimed_today && (
                                    <span className="absolute top-0 right-0 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
                                    </span>
                                )}
                            </motion.div>
                            <span className="text-[11px] font-bold text-slate-600 mt-3 group-hover:text-orange-500 transition-colors uppercase tracking-wider text-center whitespace-nowrap">
                                Daily Check-in
                            </span>
                        </div>

                        {/* Share Referral Link Trigger */}
                        <div
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex flex-col items-center cursor-pointer group"
                        >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:bg-sky-600 transition-all duration-300"
                        >
                            <Share2 size={28} />
                        </motion.div>
                        <span className="text-[11px] font-bold text-slate-600 mt-3 group-hover:text-sky-600 transition-colors uppercase tracking-wider text-center whitespace-nowrap">
                            Share Link
                        </span>
                    </div>
                </div>
                </div>

                {/* Main Layout Grid */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* Left Side: Your beautiful custom Sidebar */}
                    <div className="w-full lg:w-auto">
                        <ProfileSidebar />
                    </div>

                    {/* Right Side: The Content Area */}
                    <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 lg:p-8 min-h-[500px]">
                        {/* <Outlet /> is where React Router injects the components for 
                            /basic-info, /personal-info, /security, etc., based on the URL!
                        */}
                        <Outlet />
                    </div>

                </div>
            </div>

            {/* Share Modal Overlay */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsShareModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Share Referral</h3>
                                    <button
                                        onClick={() => setIsShareModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                                    Copy your unique referral link below and share it with your friends to earn rewards.
                                </p>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                            <Share2 size={18} />
                                        </div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={referralLink || "Fetching link..."}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-default"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCopy}
                                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${copied
                                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                                            : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'
                                            }`}
                                    >
                                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                                        {copied ? 'Link Copied!' : 'Copy Referral Link'}
                                    </motion.button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                        Secure sharing activated
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Daily Check-In Modal Overlay */}
            <AnimatePresence>
                {isCheckInModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 bg-slate-900/40 backdrop-blur-sm sm:bg-slate-900/60"
                        onClick={() => setIsCheckInModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#f3f4f6] sm:rounded-[2.5rem] w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-y-auto flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 bg-white sm:bg-transparent sm:pt-8">
                                <button onClick={() => setIsCheckInModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-700">
                                    <ChevronLeft size={24} />
                                </button>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Daily Check-in</h3>
                                <button onClick={handleManualRefresh} className={`p-2 hover:bg-slate-200 rounded-full transition-colors text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`}>
                                    <RotateCw size={20} />
                                </button>
                            </div>

                            <div className="px-6 pb-8 pt-2">
                                {/* Orange Gradient Card */}
                                <div className="w-full bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl p-6 flex flex-col items-center justify-center text-white shadow-lg shadow-orange-200 mb-8 relative overflow-hidden">
                                    {/* Decorative glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-1 relative z-10">
                                        <Flame size={32} className="text-yellow-200 drop-shadow-md" fill="currentColor" />
                                        <span className="text-3xl font-black drop-shadow-sm">{checkInStatus?.current_streak_count || 0} Days</span>
                                    </div>
                                    <span className="text-sm font-medium text-white/90 mb-4 relative z-10">Current Streak</span>
                                    
                                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2 flex items-center gap-2 relative z-10">
                                        <Trophy size={14} className="text-yellow-200" />
                                        <span className="text-xs font-bold text-white tracking-wide">
                                            {checkInStatus?.is_claimed_today ? "Today's bonus claimed!" : "Claim today's bonus now!"}
                                        </span>
                                    </div>
                                </div>

                                {/* Streak Timeline */}
                                <h4 className="text-base font-black text-slate-800 mb-4 px-1">Streak Timeline</h4>
                                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex items-start justify-between relative mb-6 overflow-x-auto hide-scrollbar">
                                    {checkInStatus?.streak_timeline?.map((day: any, i: number) => {
                                        const isCompleted = day.status === 'completed';
                                        return (
                                            <div key={day.day || i} className="flex flex-col items-center gap-2 relative z-10 min-w-[48px]">
                                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                                    {isCompleted ? <Check size={18} strokeWidth={3} /> : <Lock size={16} />}
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-[9px] sm:text-[10px] font-bold tracking-tight ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>Day {day.day}</div>
                                                    <div className={`text-[10px] sm:text-[11px] font-black ${isCompleted ? 'text-emerald-600' : 'text-slate-300'}`}>+{day.bonus}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Connection lines logic */}
                                    <div className="absolute top-[38px] sm:top-[40px] left-8 right-8 h-[2px] bg-slate-100 z-0 hidden sm:block" />
                                </div>

                                {/* Bottom Action */}
                                {checkInStatus?.is_claimed_today ? (
                                    <>
                                        <button disabled className="w-full py-4 bg-slate-200/60 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed">
                                            <CheckCircle2 size={20} />
                                            Already Claimed Today
                                        </button>
                                        <div className="mt-4 p-4 bg-[#eef2ff]/80 border border-indigo-100/50 rounded-2xl flex gap-3 text-left">
                                            <Info size={20} className="text-orange-400 shrink-0 mt-0.5" />
                                            <span className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                                Come back tomorrow to continue your streak and earn more bonuses!
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleClaimCheckIn} 
                                            disabled={isClaiming}
                                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 transition-all disabled:opacity-70"
                                        >
                                            {isClaiming ? <RotateCw className="animate-spin" size={20} /> : <Flame size={20} />}
                                            Claim Today's Bonus
                                        </motion.button>
                                        <div className="mt-4 p-4 bg-amber-50 border border-amber-100/50 rounded-2xl flex gap-3 text-left">
                                            <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-[13px] text-slate-600 font-medium leading-relaxed">
                                                Don't forget to check in today! Missing a day will reset your streak back to day 1.
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}