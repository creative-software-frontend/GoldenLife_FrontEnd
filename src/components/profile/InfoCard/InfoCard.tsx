import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string | null | undefined;
}

export const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 group">
        <div className="flex-shrink-0 p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
            <Icon size={18} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="overflow-hidden flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-[15px] font-medium text-slate-700 mt-0.5 break-words tracking-tight leading-tight">
                {value || 'Not Provided'}
            </p>
        </div>
    </div>
);