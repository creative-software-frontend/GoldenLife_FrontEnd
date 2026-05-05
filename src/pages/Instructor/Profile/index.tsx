import { useState } from 'react';
import { useInstructorProfile } from './hooks/useInstructorProfile';
import { InstructorHeader } from './components/InstructorHeader';
import { InstructorInfo } from './components/InstructorInfo';
import { InstructorForm } from './components/InstructorForm';
import { InstructorStatsCard } from './components/InstructorStatsCard';
import { toast } from 'react-toastify';
import { Loader2, AlertCircle, ShieldCheck, Settings, LogOut, Key, Plus, FileText, Headphones, Phone, HelpCircle, Ticket, GraduationCap, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useModalStore from '@/store/modalStore';
import { useAppStore } from '@/store/useAppStore';

export default function InstructorProfile() {
  const navigate = useNavigate();
  const { setIsAIChatOpen, setIsHotlineModalOpen, setIsFAQModalOpen, setIsTicketModalOpen } = useModalStore();
  const { fetchProfile } = useAppStore();
  const { data, isLoading, error, updateProfile, deleteField } = useInstructorProfile();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 font-bold animate-pulse">Loading instructor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Profile Unavailable</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error || 'Unable to access profile at this time'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const { user, instructor } = data;

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      });

      if (profileImage) {
        dataToSend.append('image', profileImage);
      }

      const success = await updateProfile(dataToSend);
      if (success) {
        toast.success('Profile modernized successfully! ✨');
        setIsEditMode(false);
        handleImageRemove();
        fetchProfile(true); // Update global Zustand store so Navbar syncs automatically
      }
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header with Stats Integrated Design */}
        <InstructorHeader
          name={instructor.name}
          email={instructor.email}
          instructorId={instructor.instructor_id}
          imageUrl={instructor.image || instructor.profile_image || user.image || user.profile_image}
          onEditToggle={() => setIsEditMode(true)}
        />

        <InstructorStatsCard
          balance={user.balance}
          totalCourses={8}
          totalStudents={1240}
          rating={4.9}
        />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Info Area */}
          <div className="lg:col-span-8 space-y-8">
            {isEditMode ? (
              <div id="edit-profile-form" className="bg-white rounded-[40px] shadow-xl p-8 md:p-10 border border-slate-100 scroll-mt-24">
                <div className="flex items-center justify-between mb-10 pb-6 border-b-2 border-slate-50">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Modify Profile</h2>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Update your professional identity</p>
                  </div>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors font-black text-slate-600 text-xs"
                  >
                    Cancel Edit
                  </button>
                </div>

                <InstructorForm
                  user={user}
                  instructor={instructor}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsEditMode(false)}
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>
            ) : (
              <InstructorInfo user={user} instructor={instructor} />
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-100 sticky top-28">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Settings className="text-indigo-600" size={20} /> Quick Settings
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/instructor/dashboard/change-password')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                      <Key size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Security & Credentials</span>
                  </div>
                  <ShieldCheck size={18} className="text-emerald-500" />
                </button>
              </div>

              {/* Verification Status */}
              <div className="mt-8 pt-8 border-t-2 border-slate-50 mb-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</span>
                    <span className="text-sm font-black text-emerald-600 mt-1">✓ Fully Verified</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-emerald-500" size={24} />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Plus className="text-indigo-600" size={20} /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton
                    icon={Plus}
                    label="Create Course"
                    onClick={() => navigate('/instructor/dashboard/courses/add')}
                    variant="primary"
                  />
                  <QuickActionButton
                    icon={FileText}
                    label="Report"
                    onClick={() => toast.info('Report feature coming soon!')}
                  />
                  <QuickActionButton
                    icon={Bot}
                    label="Support AI"
                    onClick={() => setIsAIChatOpen(true)}
                  />
                  <QuickActionButton
                    icon={Phone}
                    label="Hotline"
                    onClick={() => setIsHotlineModalOpen(true)}
                  />
                  <QuickActionButton
                    icon={HelpCircle}
                    label="FAQ"
                    onClick={() => setIsFAQModalOpen(true)}
                  />
                  <QuickActionButton
                    icon={Ticket}
                    label="Ticket"
                    onClick={() => setIsTicketModalOpen(true)}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate('/instructor/login')}
                className="w-full mt-8 py-4 flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 font-black rounded-2xl transition-all active:scale-95 group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'outline' }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all active:scale-95 gap-2 border-2 ${
      variant === 'primary' 
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
        : 'bg-white border-slate-50 text-slate-600 hover:border-indigo-100 hover:bg-indigo-50/30'
    }`}
  >
    <div className={`p-2 rounded-xl ${variant === 'primary' ? 'bg-white/20' : 'bg-slate-50 text-indigo-600'}`}>
      <Icon size={20} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);
