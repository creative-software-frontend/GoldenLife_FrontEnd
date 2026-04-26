import { useState } from 'react';
import { Mail, Phone, User, BookOpen, Briefcase, Building2, Calendar, Globe, Facebook, MessageCircle, Smartphone, Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface InstructorInfoProps {
  user: any;
  instructor: any;
  onDeleteField: (field: string) => Promise<void>;
}

export function InstructorInfo({ user, instructor }: Omit<InstructorInfoProps, 'onDeleteField'>) {
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

  return (
    <div className="space-y-6 relative">
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

