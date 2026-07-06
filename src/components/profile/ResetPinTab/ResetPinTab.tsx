import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Loader2, AlertTriangle, Phone, KeyRound, Lock, EyeOff, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function ResetPinTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset PIN
    const [showNewPin, setShowNewPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);

    const [formData, setFormData] = useState({
        mobile: '',
        otp: '',
        pin: '',
        pin_confirmation: ''
    });

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mobile) {
            toast.error("Please enter your mobile number.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/api/pin/forgot`,
                { mobile: formData.mobile },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data?.success) {
                toast.success(response.data?.message || "Reset OTP sent to your mobile.");
                setStep(2);
            } else {
                toast.error(response.data?.message || "Failed to send OTP.");
            }
        } catch (error: any) {
            console.error('Send OTP Error:', error);
            toast.error(error.response?.data?.message || "An error occurred while sending OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.pin !== formData.pin_confirmation) {
            toast.error("New PINs do not match!");
            return;
        }

        if (formData.pin.length < 4) {
            toast.error("PIN must be at least 4 digits long.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${baseURL}/api/pin/reset`,
                {
                    mobile: formData.mobile,
                    otp: Number(formData.otp),
                    pin: formData.pin,
                    pin_confirmation: formData.pin_confirmation
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.data?.success) {
                toast.success(response.data?.message || "PIN reset successful!");
                setStep(1);
                setFormData({ mobile: '', otp: '', pin: '', pin_confirmation: '' });
            } else {
                toast.error(response.data?.message || "Failed to reset PIN.");
            }
        } catch (error: any) {
            console.error('Reset PIN Error:', error);
            toast.error(error.response?.data?.message || "An error occurred while resetting PIN.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-inter">
            {/* Warning Alert Banner */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 relative overflow-hidden group shadow-sm"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-inner">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-amber-800 tracking-tight">Security Alert!</h3>
                        <p className="text-sm font-bold text-amber-700/80 mt-1">Do not share your PIN with anyone. Keep your account secure.</p>
                    </div>
                </div>
            </motion.div>

            {/* Reset PIN Form Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-600">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight italic">Reset Security PIN</h2>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-2 group/field">
                                <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-emerald-600/10 group-focus-within/field:text-emerald-600 transition-all">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        maxLength={11}
                                        placeholder="Enter your registered mobile number"
                                        className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            <div className="pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full h-14 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    {isLoading ? (
                                        <><Loader2 className="animate-spin" size={20} /><span className="uppercase tracking-[0.2em] text-sm">Processing...</span></>
                                    ) : (
                                        <><ShieldCheck size={20} className="group-hover/btn:rotate-12 transition-transform" /><span className="uppercase tracking-[0.2em] text-sm">Send OTP</span></>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPin} className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-2 group/field">
                                <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">OTP</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-emerald-600/10 group-focus-within/field:text-emerald-600 transition-all">
                                        <KeyRound size={16} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="Enter OTP sent to your mobile"
                                        className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2 group/field">
                                <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">New PIN</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-emerald-600/10 group-focus-within/field:text-emerald-600 transition-all">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        required
                                        type={showNewPin ? 'text' : 'password'}
                                        name="pin"
                                        value={formData.pin}
                                        onChange={handleChange}
                                        placeholder="Enter new PIN"
                                        className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPin(!showNewPin)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                                    >
                                        {showNewPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 group/field">
                                <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">Confirm PIN</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-emerald-600/10 group-focus-within/field:text-emerald-600 transition-all">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        required
                                        type={showConfirmPin ? 'text' : 'password'}
                                        name="pin_confirmation"
                                        value={formData.pin_confirmation}
                                        onChange={handleChange}
                                        placeholder="Confirm new PIN"
                                        className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                                    >
                                        {showConfirmPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full h-14 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    {isLoading ? (
                                        <><Loader2 className="animate-spin" size={20} /><span className="uppercase tracking-[0.2em] text-sm">Processing...</span></>
                                    ) : (
                                        <><ShieldCheck size={20} className="group-hover/btn:rotate-12 transition-transform" /><span className="uppercase tracking-[0.2em] text-sm">Reset PIN</span></>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
