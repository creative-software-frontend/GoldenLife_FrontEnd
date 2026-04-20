import { useState, useEffect } from 'react';
import {
    User,
    ShieldCheck,
    Loader2,
    Edit2,
    CheckCircle2,
    Image as ImageIcon,
    Phone,
    Heart,
    Eye
} from 'lucide-react';
import EditNomineeInfoTabModal from '../EditNomineeInfoTabModal/EditNomineeInfoTabModal';
import { useAppStore } from '@/store/useAppStore';
import { getAuthToken } from '@/store/utils';
import { InfoCard } from '../InfoCard/InfoCard';

export default function NomineeInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const nomineeData = useAppStore(s => s.nomineeInfo);
    const loading = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const token = getAuthToken();

    // Helper to get correct path for nominee documents
    const getNomineeDocUrl = (fileName: string, type: 'nominee_image' | 'nominee_nid_front_page' | 'nominee_nid_back_page') => {
        if (!fileName) return null;
        return `${baseURL}/uploads/student/${type}/${fileName}`;
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLocalUpdate = () => {
        fetchProfile(true);
    };

    if (loading && !nomineeData) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading nominee details...</p>
                    <p className="text-xs text-slate-400 font-medium">Syncing record for verification</p>
                </div>
            </div>
        );
    }

    if (!nomineeData) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative flex items-center gap-4">
                    {/* Nominee Photo (Left Side) */}
                    <div className="w-16 h-16 shrink-0 rounded-full border-2 border-emerald-100 shadow-sm overflow-hidden bg-slate-50 relative">
                        {nomineeData.nominee_image ? (
                            <img
                                src={getNomineeDocUrl(nomineeData.nominee_image, 'nominee_image') || ''}
                                className="w-full h-full object-cover"
                                alt="Nominee Photo"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-emerald-200">
                                <User size={24} />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight italic">Nominee Details</h2>
                        <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            Legal Representative & Inheritance Record
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Edit Nominee</span>
                </button>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <User size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact & Identification</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={User} label="Full Name" value={nomineeData.nominee_name} />
                        <InfoCard icon={Phone} label="Mobile Number" value={nomineeData.nominee_mobile} />
                        <InfoCard icon={Heart} label="Relation Profile" value={nomineeData.relation_with} />
                        <InfoCard icon={CheckCircle2} label="Nominee NID Number" value={nomineeData.nominee_nid_number} />
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm mt-0.5">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-emerald-900 tracking-widest uppercase">Security Notice</p>
                            <p className="text-[11px] leading-relaxed text-emerald-700/80 font-medium italic">
                                Nominee information is required for account security and inheritance purposes. Ensure these details match official identification documents.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <ImageIcon size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Previews</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">NID Front</p>
                            <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img shadow-sm hover:shadow-md transition-shadow">
                                {nomineeData.nominee_nid_front_page ? (
                                    <>
                                        <img src={getNomineeDocUrl(nomineeData.nominee_nid_front_page, 'nominee_nid_front_page') || ''} className="w-full h-full object-cover" alt="NID Front" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="text-white" size={20} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">NID Back</p>
                            <div className="relative aspect-[3/2] rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group/img shadow-sm hover:shadow-md transition-shadow">
                                {nomineeData.nominee_nid_back_page ? (
                                    <>
                                        <img src={getNomineeDocUrl(nomineeData.nominee_nid_back_page, 'nominee_nid_back_page') || ''} className="w-full h-full object-cover" alt="NID Back" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye className="text-white" size={20} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditNomineeInfoTabModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={nomineeData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}

