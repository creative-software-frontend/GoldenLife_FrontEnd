import { useState, useEffect } from 'react';
import {
    FileText,
    ShieldCheck,
    Loader2,
    Edit2,
    CheckCircle2,
    Image as ImageIcon,
    Eye
} from 'lucide-react';
import EditDocumentInfoTabModal from '../EditDocumentInfoTabModal/EditDocumentInfoTabModal';
import { InfoCard } from '../InfoCard/InfoCard';
import { useAppStore } from '@/store/useAppStore';
import { getAuthToken } from '@/store/utils';

export default function DocumentInfoTab() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const documentData = useAppStore(s => s.documentInfo);
    const loading = useAppStore(s => s.isProfileLoading);
    const fetchProfile = useAppStore(s => s.fetchProfile);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const token = getAuthToken();

    // Helper to get correct path for documents
    const getDocUrl = (fileName: string, type: 'nid_front_page' | 'nid_back_page') => {
        if (!fileName) return null;
        return `${baseURL}/uploads/student/${type}/${fileName}`;
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLocalUpdate = () => {
        fetchProfile(true);
    };

    if (loading && !documentData) {
        return (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-4 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                    <Loader2 className="animate-spin text-emerald-600 relative" size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700">Loading document details...</p>
                    <p className="text-xs text-slate-400 font-medium">Verifying your identification records</p>
                </div>
            </div>
        );
    }

    if (!documentData) return null;

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight italic">Identity Documents</h2>
                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Verification & Compliance Status
                    </p>
                </div>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all group/btn"
                >
                    <Edit2 size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Manage Documents</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Verification</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <InfoCard icon={FileText} label="National ID (NID) Number" value={documentData.nid_number} />
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm">
                                <CheckCircle2 size={16} />
                            </div>
                            <p className="text-[11px] font-bold text-emerald-800 tracking-tight">System holds active verification records for this student.</p>
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
                                {documentData.nid_front_page ? (
                                    <>
                                        <img src={getDocUrl(documentData.nid_front_page, 'nid_front_page') || ''} className="w-full h-full object-cover" alt="NID Front" />
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
                                {documentData.nid_back_page ? (
                                    <>
                                        <img src={getDocUrl(documentData.nid_back_page, 'nid_back_page') || ''} className="w-full h-full object-cover" alt="NID Back" />
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

            <EditDocumentInfoTabModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={documentData}
                baseURL={baseURL}
                token={token}
                onSuccess={handleLocalUpdate}
            />
        </div>
    );
}