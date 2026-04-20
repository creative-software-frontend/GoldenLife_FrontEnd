import { useState, useEffect } from 'react';
import { Edit2, Mail, Phone, User as UserIcon, Hash, Fingerprint, Activity, ShieldCheck } from 'lucide-react';
import DataRow from '@/components/ui/DataRow';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import useModalStore from '@/store/modalStore';
import { useAppStore } from '@/store/useAppStore';
import { baseURL } from '@/store/utils';


export interface StudentData {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    affiliate_id: string;
    mobile: string;
    image: string;
    refer_code: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    student_id: string;
}

export default function BasicInfoTab() {
    const student = useAppStore(s => s.studentProfile);
    const loading = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const profileUpdateTrigger = useModalStore(s => s.profileUpdateTrigger);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, profileUpdateTrigger]);

    if (loading && !student) return <LoadingSkeleton />;

    const displayReferCode = student?.refer_code || 'Not generated yet';


    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{student?.name || 'Loading...'}</h2>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
                                Verified Member
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn w-full sm:w-auto overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <Edit2 size={18} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
                    <span className="relative z-10 uppercase tracking-widest text-[10px]">Edit Account</span>
                </button>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Personal Identity */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <UserIcon size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 tracking-tight">Personal Identity</h3>
                    </div>
                    <div className="space-y-1">
                        <DataRow label="Full Name" value={student?.name || '—'} icon={<UserIcon size={14} />} />
                        <DataRow label="Email Address" value={student?.email || '—'} icon={<Mail size={14} />} />
                        <DataRow label="Mobile" value={student?.mobile || '—'} icon={<Phone size={14} />} isLast />
                    </div>
                </div>

                {/* Account Affiliation */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Fingerprint size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 tracking-tight">Account Affiliation</h3>
                    </div>
                    <div className="space-y-1">
                        <DataRow
                            label="Referral Code"
                            value={displayReferCode}
                            icon={<Hash size={14} />}
                        />
                        <DataRow label="Affiliate ID" value={student?.affiliate_id || '—'} icon={<ShieldCheck size={14} />} />
                        <DataRow label="Status" icon={<Activity size={14} />} value={<StatusBadge status={student?.status} />} isLast />
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                student={student}
                baseURL={baseURL}
            />
        </div>
    );
}

const StatusBadge = ({ status }: { status?: string }) => {
    const isActive = status?.toLowerCase() === 'active';
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
                {isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className={`${isActive ? 'text-emerald-600' : 'text-rose-600'} font-bold text-[11px] uppercase tracking-widest`}>
                {isActive ? 'Active Account' : 'Inactive Account'}
            </span>
        </div>
    );
};

function LoadingSkeleton() {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 animate-pulse">
                <div className="flex items-center gap-6">
                    <div className="space-y-3">
                        <div className="h-8 bg-slate-100 rounded-lg w-48" />
                        <div className="h-4 bg-slate-50 rounded-lg w-32" />
                    </div>
                </div>
                <div className="h-14 bg-slate-100 rounded-2xl w-40 hidden sm:block" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                <div className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />
            </div>
        </div>
    );
}