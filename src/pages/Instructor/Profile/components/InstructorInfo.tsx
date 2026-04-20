import { useState } from 'react';
import { Mail, Phone, User, BookOpen, Briefcase, Building2, Calendar, Globe, Facebook, MessageCircle, Smartphone, Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface InstructorInfoProps {
  user: any;
  instructor: any;
  onDeleteField: (field: string) => Promise<void>;
}

export function InstructorInfo({ user, instructor, onDeleteField }: InstructorInfoProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingField, setPendingField] = useState<{ id: string; label: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const safeInstructor = instructor || {};
  const safeUser = user || {};

  const infoSections = [
    {
      title: 'Personal Information',
      icon: User,
      color: 'bg-primary-light/10 text-primary-light',
      items: [
        { label: 'Full Name', value: safeInstructor.name || safeUser.name, icon: User, field: 'name' },
        { label: 'Email Address', value: safeInstructor.email || safeUser.email, icon: Mail, field: 'email' },
        { label: 'Mobile Number', value: safeInstructor.mobile || safeUser.mobile, icon: Phone, field: 'mobile' },
        { label: 'Gender', value: safeInstructor.gender, icon: User, field: 'gender' },
        { label: 'Date of Birth', value: safeInstructor.date_of_birth, icon: Calendar, field: 'date_of_birth' },
      ]
    },
    {
      title: 'Professional Profile',
      icon: BookOpen,
      color: 'bg-secondary/10 text-secondary',
      items: [
        { label: 'Qualification', value: safeInstructor.qualification, icon: BookOpen, field: 'qualification' },
        { label: 'Experience', value: safeInstructor.experience, icon: Briefcase, field: 'experience' },
        { label: 'Designation', value: safeInstructor.designation, icon: Building2, field: 'designation' },
        { label: 'Department', value: safeInstructor.department, icon: Building2, field: 'department' },
        { label: 'Academy Name', value: safeInstructor.business_name, icon: Building2, field: 'business_name' },
        { label: 'Joining Date', value: safeInstructor.joining_date, icon: Calendar, field: 'joining_date' },
      ]
    },
    {
      title: 'Online & Contact',
      icon: Globe,
      color: 'bg-indigo-500/10 text-indigo-500',
      items: [
        { label: 'Website', value: safeInstructor.website, icon: Globe, field: 'website' },
        { label: 'Facebook', value: safeInstructor.facebook, icon: Facebook, field: 'facebook' },
        { label: 'Telegram', value: safeInstructor.telegram, icon: MessageCircle, field: 'telegram' },
        { label: 'WhatsApp', value: safeInstructor.whatsapp, icon: Smartphone, field: 'whatsapp' },
      ]
    }
  ];

  const handleConfirmDelete = async () => {
    if (!pendingField) return;
    
    try {
      setIsDeleting(true);
      await onDeleteField(pendingField.id);
      toast.success(`${pendingField.label} removed successfully ✨`);
      setShowConfirm(false);
      setPendingField(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete field');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Premium Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 text-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>

                <div className="w-20 h-20 bg-orange-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
                  <AlertTriangle className="w-10 h-10 text-orange-500" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Remove Information?</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                  Are you sure you want to delete your <span className="text-slate-800 font-black">{pendingField?.label}</span>? 
                  This action will clear the data from your profile.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Yes, Delete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {infoSections.map((section, idx) => (
        <div key={idx} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
            <div className={`p-2 rounded-xl ${section.color}`}>
              <section.icon size={20} />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">{section.title}</h3>
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="group relative">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary-light/5 group-hover:text-primary-light transition-colors">
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-gray-900 truncate">
                        {item.value || (
                          <span className="text-gray-300 italic font-medium">Not provided</span>
                        )}
                      </p>
                      
                      {item.field && item.value && (
                        <button 
                          onClick={() => {
                            setPendingField({ id: item.field!, label: item.label });
                            setShowConfirm(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all rounded-md hover:bg-red-50"
                          title={`Delete ${item.label}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
