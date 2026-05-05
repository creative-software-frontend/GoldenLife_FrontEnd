import { useState } from 'react';
import { Mail, Phone, User, BookOpen, Briefcase, Building2, Calendar, Globe, Facebook, MessageCircle, Smartphone, Trash2, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface InstructorInfoProps {
  user: any;
  instructor: any;
  onDeleteField: (field: string) => Promise<void>;
}

export function InstructorInfo({ user, instructor }: Omit<InstructorInfoProps, 'onDeleteField'>) {
  const safeInstructor = instructor || {};
  const safeUser = user || {};
  const { percentage, isComplete, missingFields } = useProfileCompletion(safeInstructor, 'instructor');

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

  return (
    <div className="space-y-6 relative">
      {/* Profile Completion Progress */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-light/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Profile Completion</h3>
            <p className="text-sm font-bold text-gray-400 max-w-md leading-relaxed">
              {isComplete 
                ? 'Excellent! Your profile is 100% complete. You have full access to all features.' 
                : `Complete your professional profile to 100% to unlock course management features.`}
            </p>
          </div>
          
          <div className="flex items-center gap-6 min-w-[300px]">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile Status</span>
                <span className={`text-sm font-black ${isComplete ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    isComplete 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  } shadow-lg shadow-orange-500/20`}
                />
              </div>
            </div>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isComplete ? 'bg-emerald-50 text-emerald-500 shadow-emerald-500/10' : 'bg-orange-50 text-orange-500 shadow-orange-500/10'
            }`}>
              {isComplete ? <CheckCircle2 size={32} strokeWidth={2.5} /> : <AlertTriangle size={32} strokeWidth={2.5} />}
            </div>
          </div>
        </div>

        {!isComplete && missingFields.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-8 pt-8 border-t border-gray-100"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Required fields to complete:</p>
            <div className="flex flex-wrap gap-3">
              {missingFields.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 text-[11px] font-bold rounded-xl border border-gray-100 uppercase tracking-tight group-hover:bg-white transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {field}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

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
