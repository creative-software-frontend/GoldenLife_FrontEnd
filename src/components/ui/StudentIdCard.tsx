import { Cpu, Coins, Sparkles } from 'lucide-react';

// Define the props so we can set a different name/data dynamically
interface StudentIdCardProps {
    name?: string;
    email?: string;
    status?: string;
    totalRefer?: number;
    level?: number;
    balance?: number;
}

export default function StudentIdCard({
    name = "Shourov Hasan", // Fallback defaults
    email = "shourovhasan@gmail.com",
    status = "active",
    totalRefer = 0,
    level = 1,
    balance = 0
}: StudentIdCardProps) {
    return (
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 text-white border border-white/10 bg-slate-900 group transition-transform duration-300 hover:-translate-y-1">
            
            {/* --- Awesome Background Gradients & Glow Effects --- */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 -z-20"></div>
            {/* Top right Primary (Orange) Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10 transition-opacity duration-500 group-hover:opacity-75"></div>
            {/* Bottom left Secondary (Green) Glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl -z-10"></div>

            {/* --- Top Row: Logo & Chip --- */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary" size={20} />
                    <span className="font-bold tracking-widest text-sm opacity-90 uppercase">
                        Golden Life
                    </span>
                </div>
                {/* Microchip icon styling */}
                <Cpu className="text-slate-300/70" size={32} strokeWidth={1.5} />
            </div>

            {/* --- Middle Row: Dynamic Name, Email & Status --- */}
            <div className="mt-8 mb-6">
                <h2 className="text-2xl font-extrabold uppercase tracking-widest text-white/95 drop-shadow-md truncate">
                    {name}
                </h2>
                <p className="text-slate-300/80 text-sm font-medium mt-1 truncate">
                    {email}
                </p>

                {status === 'active' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-xs font-semibold text-secondary shadow-sm backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                        Active Student
                    </div>
                )}
            </div>

            {/* --- Bottom Row: Stats --- */}
            <div className="flex items-center justify-between pt-5 border-t border-white/10 text-sm mt-2">
                
                {/* Total Referrals */}
                <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                        Total Refer
                    </span>
                    <span className="font-bold text-white/90 text-base">{totalRefer}</span>
                </div>
                
                {/* Level */}
                <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                        Level
                    </span>
                    <span className="font-bold text-white/90 text-base">{level}</span>
                </div>
                
                {/* Balance */}
                <div className="flex flex-col items-end">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">
                        Balance
                    </span>
                    <div className="flex items-center gap-1.5 font-extrabold text-primary text-base">
                        <Coins size={16} className="text-primary/80" />
                        {balance}
                    </div>
                </div>

            </div>
        </div>
    );
}