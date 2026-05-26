import { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInstructorChangePasswordMutation } from '@/hooks/useInstructorAuth';

export default function InstructorChangePassword() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    old_password: '',
    password: '',
    confirm_password: ''
  });

  const changePasswordMutation = useInstructorChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (formData.password !== formData.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await changePasswordMutation.mutateAsync({
        old_password: formData.old_password,
        password: formData.password,
        password_confirmation: formData.confirm_password
      });

      if (response.status === true || (response as any).success === true) {
        setSuccessMessage(response.message || "Password updated successfully! Your account is secure.");
        toast.success(response.message || "Password updated successfully! ✨");
        setFormData({ old_password: '', password: '', confirm_password: '' });
        setTimeout(() => navigate('/instructor/dashboard/profile'), 2000);
      } else {
        toast.error(response.message || "Failed to update password.");
      }
    } catch (error: any) {
      console.error('Instructor Password Update Error:', error);
      toast.error(error.message || "An error occurred while updating your password.");
    }
  };

  const isLoading = changePasswordMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen bg-slate-50/30">
      {/* Back Button */}
      <button
        onClick={() => navigate('/instructor/dashboard/profile')}
        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all font-bold shadow-sm active:scale-95"
      >
        <ArrowLeft size={18} />
        <span>Back to Profile</span>
      </button>

      {/* Warning Alert */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-100 rounded-[30px] p-6 relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full -mr-16 -mt-16 blur-2xl" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shadow-inner">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-amber-800 tracking-tight">Security Alert!</h3>
            <p className="text-sm font-bold text-amber-700/80 mt-1">Do not share your password with anyone. Choose a password that is complex and hard to guess.</p>
          </div>
        </div>
      </motion.div>

      {/* Change Password Form */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Update Security Credentials</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Protect your professional profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-700 shadow-sm"
              >
                <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-sm font-bold tracking-wide">{successMessage}</p>
              </motion.div>
            )}

            {/* Current Password */}
            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-indigo-50 group-focus-within/field:text-indigo-600 transition-all">
                  <Lock size={16} />
                </div>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="py-2 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">New Credentials</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* New Password */}
            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-indigo-50 group-focus-within/field:text-indigo-600 transition-all">
                  <Lock size={16} />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                  placeholder="Create a strong new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 group/field">
              <label className="text-[11px] font-black text-slate-400 p-2 uppercase tracking-widest ml-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg text-slate-400 group-focus-within/field:bg-indigo-50 group-focus-within/field:text-indigo-600 transition-all">
                  <Lock size={16} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="w-full pl-14 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                  placeholder="Verify your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                type="submit"
                className="w-full h-14 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-[0.2em] text-sm">Processing Security...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="uppercase tracking-[0.2em] text-sm font-bold">Update Password</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center pb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Golden Life Global Security Protocols Active
        </p>
      </div>
    </div>
  );
}
