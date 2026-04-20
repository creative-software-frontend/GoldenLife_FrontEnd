import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, Send, X, ChevronRight, Bell, RotateCcw, DollarSign, Users, Wallet, BookOpen, LifeBuoy, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getVendorAvatarUrl, getVendorDisplayName } from '@/hooks/useVendorProfile';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('global');
  const [view, setView] = useState<'initial' | 'chat'>('initial');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Access Zustand Store for both student & vendor profiles
  const { chatbotMessages, isChatbotLoading, sendChatbotMessage, clearChatbotMessages, studentProfile, vendorProfile } = useAppStore();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // Determine active user type from session storage
  const isVendorSession = !!sessionStorage.getItem('vendor_session');
  const isStudentSession = !!sessionStorage.getItem('student_session');

  // Resolve profile image and display name for current panel
  const profileImageUrl: string | null = (() => {
    if (isVendorSession && vendorProfile) {
      const vendorUrl = getVendorAvatarUrl(vendorProfile as any);
      return vendorUrl || null;
    }
    if (isStudentSession && studentProfile?.image) {
      // Use the same path convention as UserLayout
      return studentProfile.image.startsWith('http')
        ? studentProfile.image
        : `${baseURL}/uploads/student/image/${studentProfile.image}`;
    }
    return null;
  })();

  const displayName: string = (() => {
    if (isVendorSession && vendorProfile) {
      return getVendorDisplayName(vendorProfile as any);
    }
    return studentProfile?.name || '';
  })();

  const nameInitial = displayName.charAt(0).toUpperCase() || '?';

  const handleClearChat = () => {
    clearChatbotMessages();
    setView('initial');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat' && isOpen) {
      scrollToBottom();
    }
  }, [chatbotMessages, view, isOpen]);

  const handleQuestionClick = (questionKey: string) => {
    const questionText = t(`chatbot.questions.${questionKey}`);
    handleSendMessage(questionText);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isChatbotLoading) return;
    
    if (view === 'initial') setView('chat');
    setInputText('');
    
    await sendChatbotMessage(text);
  };

  const studentQuestions = [
    { id: 'earnMoney',      icon: <DollarSign size={18} /> },
    { id: 'referralIncome', icon: <Users size={18} /> },
    { id: 'walletWithdraw', icon: <Wallet size={18} /> },
    { id: 'courseEnroll',   icon: <BookOpen size={18} /> },
    { id: 'supportTicket',  icon: <LifeBuoy size={18} /> },
  ];

  const vendorQuestions = [
    { id: 'vendor_startReseller',  icon: <MessageSquare size={18} /> },
    { id: 'vendor_listProduct',    icon: <MessageSquare size={18} /> },
    { id: 'vendor_paymentMethods', icon: <MessageSquare size={18} /> },
    { id: 'vendor_trackOrder',     icon: <MessageSquare size={18} /> },
    { id: 'vendor_withdrawTime',   icon: <MessageSquare size={18} /> },
  ];

  const initialQuestions = isVendorSession ? vendorQuestions : studentQuestions;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 z-[60] h-full w-full max-w-md bg-white shadow-2xl flex flex-col no-print border-l border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#67AC79] to-[#589668] p-4 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-white/20 p-2 rounded-full border border-white/30 backdrop-blur-sm">
                  <Bot size={28} className="text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#67AC79] rounded-full shadow-sm"></div>
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight tracking-tight">{t('chatbot.title')}</h2>
                <div className="flex items-center text-[10px] uppercase font-bold tracking-wider opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5 animate-pulse"></span>
                  {t('chatbot.status')}
                </div>
              </div>
            </div>
             <div className="flex items-center space-x-1">
               <button 
                 onClick={handleClearChat}
                 className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                 title="Clear Chat"
               >
                 <RotateCcw size={18} />
               </button>
               <button className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90">
                 <Bell size={18} />
               </button>
               <button 
                 onClick={onClose}
                 className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
                >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
            {view === 'initial' ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 flex flex-col items-center text-center space-y-8"
              >
                {/* Brand Area */}
                <div className="w-full flex justify-center py-4">
                   <img src="/image/logo/logo.jpg" alt="Golden Life" className="h-12 w-auto object-contain" />
                </div>

                {/* Animated Bot Icon */}
                <div className="relative mt-4">
                   <motion.div
                     animate={{ 
                       y: [0, -15, 0],
                       rotate: [0, 2, -2, 0]
                     }}
                     transition={{ 
                       duration: 4, 
                       repeat: Infinity, 
                       ease: "easeInOut" 
                     }}
                     className="bg-white p-8 rounded-[40px] shadow-2xl relative z-10 border border-slate-100/50"
                   >
                     <Bot size={80} className="text-[#67AC79]" />
                     <div className="mt-4 text-[#67AC79] font-black text-xs tracking-[0.2em] border-t border-slate-50 pt-2 opacity-80 uppercase">
                        Assistant Bot
                     </div>
                   </motion.div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#67AC79]/10 blur-3xl rounded-full"></div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t('chatbot.welcome')}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                    {t('chatbot.askPrompt')}
                  </p>
                </div>

                {/* Question Buttons */}
                <div className="w-full space-y-3 pb-8">
                  {initialQuestions.map((q, index) => (
                    <motion.button
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1) }}
                      onClick={() => handleQuestionClick(q.id)}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-4 text-slate-700 font-semibold">
                        <div className="p-2 bg-slate-50 rounded-lg text-[#67AC79] group-hover:bg-[#67AC79] group-hover:text-white transition-colors">
                           {q.icon}
                        </div>
                        <span className="text-sm">{t(`chatbot.questions.${q.id}`)}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#67AC79] transition-all group-hover:translate-x-1" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="p-4 space-y-6 min-h-full">
                {/* Welcome Message in Chat View */}
                 <div className="flex justify-start items-end space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#67AC79] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                       <Bot size={16} />
                    </div>
                    <div className="max-w-[85%] bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-slate-700 text-sm">
                       <p className="font-bold text-[#67AC79] mb-1">{t('chatbot.welcome')}</p>
                       <p className="leading-relaxed">{t('chatbot.askPrompt')}</p>
                    </div>
                 </div>

                {chatbotMessages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex items-end space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'bot' && (
                       <div className="w-8 h-8 rounded-full bg-[#67AC79] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        <Bot size={16} />
                       </div>
                    )}
                    <div className={`flex flex-col space-y-1 max-w-[80%]`}>
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium whitespace-pre-wrap ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-br from-[#67AC79] to-[#589668] text-white rounded-br-none'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className={`text-[10px] font-bold text-slate-400 px-1 uppercase ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {m.timestamp}
                      </span>
                    </div>

                    {/* User Avatar: Profile image (student or vendor) → name initial fallback */}
                    {m.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm border-2 border-white overflow-hidden bg-slate-200 flex items-center justify-center">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={displayName || 'You'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent && !parent.querySelector('.name-initial')) {
                                const el = document.createElement('span');
                                el.className = 'name-initial text-xs font-bold text-slate-500';
                                el.textContent = nameInitial;
                                parent.appendChild(el);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-500">{nameInitial}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isChatbotLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end space-x-2 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#67AC79] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                      <div className="flex space-x-1">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-slate-300 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('chatbot.inputPlaceholder')}
                  className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#67AC79]/30 transition-all text-sm font-medium placeholder:text-slate-400 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isChatbotLoading}
                className={`flex-shrink-0 p-4 rounded-2xl transition-all active:scale-95 shadow-lg ${
                  inputText.trim() && !isChatbotLoading
                    ? 'bg-[#67AC79] text-white hover:bg-[#589668] shadow-[#67AC79]/20' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatbot;
