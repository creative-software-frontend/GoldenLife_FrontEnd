import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket as TicketIcon,
    Plus,
    Send,
    MessageSquare,
    Clock,
    AlertCircle,
    ChevronLeft,
    Image as ImageIcon,
    Loader2,
    ShieldCheck,
    User,
    X,
    Calendar,
    Paperclip
} from 'lucide-react';
import { useTickets, useCreateTicket, useSendMessage, useTicketDetails, Ticket } from '@/hooks/useTickets';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

type ViewMode = 'list' | 'create' | 'chat';

const SupportTicketPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentUserId = useAppStore(state => state.studentProfile?.id || state.vendorProfile?.user?.id || 0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { data: tickets, isLoading } = useTickets();
    const { data: details, isLoading: isLoadingDetails } = useTicketDetails(selectedTicket?.id || null);

    useEffect(() => {
        if (details?.conversations) {
            scrollToBottom();
        }
    }, [details?.conversations]);

    const createMutation = useCreateTicket();
    const sendMutation = useSendMessage();

    const handleBack = () => {
        setViewMode('list');
        setSelectedTicket(null);
    };

    const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!selectedImage) {
            formData.set('image', '');
        }

        try {
            await createMutation.mutateAsync(formData);
            toast.success('Ticket created successfully');
            setViewMode('list');
            setSelectedImage(null);
        } catch (error) {
            toast.error('Failed to create ticket');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedTicket) return;

        try {
            await sendMutation.mutateAsync({ ticketId: selectedTicket.id, msg: message });
            toast.success('Message sent successfully');
            setMessage('');
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'open' || s === 'completed' || s === 'success') {
            return "bg-green-100 text-green-600 border-green-200";
        }
        if (s === 'pending' || s === 'processing') {
            return "bg-orange-100 text-orange-600 border-orange-200";
        }
        return "bg-red-100 text-red-600 border-red-200";
    };

    const getPriorityStyles = (priority: string) => {
        const p = priority?.toLowerCase();
        if (p === 'low') return "text-blue-500 bg-blue-50";
        if (p === 'medium') return "text-yellow-600 bg-yellow-50";
        if (p === 'high') return "text-red-600 bg-red-50";
        return "text-gray-500 bg-gray-50";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col gap-6">
            
            {/* Header + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {(viewMode !== 'list' || selectedTicket) && (
                        <button 
                            onClick={handleBack}
                            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all"
                        >
                            <ChevronLeft size={24} className="text-slate-500" />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] flex items-center justify-center text-blue-600">
                            <TicketIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                                {viewMode === 'list' ? 'Support Tickets' : 
                                 viewMode === 'create' ? 'New Ticket' : 'Ticket Discussion'}
                            </h1>
                            {viewMode === 'chat' && selectedTicket && (
                                <p className="text-slate-400 text-sm font-medium">#{selectedTicket.id} - {selectedTicket.subject}</p>
                            )}
                        </div>
                    </div>
                </div>

                {viewMode === 'list' && (
                    <button
                        onClick={() => setViewMode('create')}
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-100 active:scale-95"
                    >
                        <Plus size={20} />
                        New Ticket
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                <AnimatePresence mode="wait">
                    {/* --- LIST VIEW --- */}
                    {viewMode === 'list' && (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Ticket ID</th>
                                            <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Subject</th>
                                            <th className="px-8 py-6 text-center text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Priority</th>
                                            <th className="px-8 py-6 text-center text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Status</th>
                                            <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={5} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                                                </tr>
                                            ))
                                        ) : tickets?.map((ticket) => (
                                            <tr 
                                                key={ticket.id}
                                                onClick={() => { setSelectedTicket(ticket); setViewMode('chat'); }}
                                                className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <span className="text-blue-600 font-bold">#{ticket.id}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                        {ticket.subject}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-center">
                                                        <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", getPriorityStyles(ticket.priority))}>
                                                            • {ticket.priority}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex justify-center">
                                                        <span className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest", getStatusStyles(ticket.status))}>
                                                            {ticket.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-sm font-medium text-slate-400">
                                                        {format(new Date(ticket.created_at), 'd.M.yyyy')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl h-40 animate-pulse border border-slate-100 shadow-sm" />
                                    ))
                                ) : tickets?.map((ticket) => (
                                    <div 
                                        key={ticket.id}
                                        onClick={() => { setSelectedTicket(ticket); setViewMode('chat'); }}
                                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-blue-600 font-black">#{ticket.id}</span>
                                            <span className={cn("px-4 py-1 rounded-lg text-[10px] font-black uppercase", getStatusStyles(ticket.status))}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 uppercase mb-4 line-clamp-2 leading-tight tracking-tight">
                                            {ticket.subject}
                                        </h4>
                                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase", getPriorityStyles(ticket.priority))}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">
                                                {format(new Date(ticket.created_at), 'dd MMM yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {tickets?.length === 0 && !isLoading && (
                                <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-24 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <AlertCircle size={48} className="text-slate-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No tickets found</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto font-medium">Have an issue? Click 'New Ticket' to get help from our support team.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- CREATE VIEW --- */}
                    {viewMode === 'create' && (
                        <motion.div 
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12 max-w-3xl mx-auto w-full"
                        >
                            <form onSubmit={handleCreateTicket} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Issue Category</label>
                                        <select 
                                            name="department"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWE5YWExIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem]"
                                        >
                                            <option value="IT Support">IT Support</option>
                                            <option value="Billing">Billing & Payment</option>
                                            <option value="General">General Inquiry</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Priority Level</label>
                                        <select 
                                            name="priority"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOWE5YWExIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem]"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Subject</label>
                                    <input 
                                        name="subject"
                                        required
                                        placeholder="Short summary of the problem"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Describe Your Issue</label>
                                    <textarea 
                                        name="description"
                                        required
                                        rows={5}
                                        placeholder="Please provide as much detail as possible..."
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Attachment (Optional)</label>
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group overflow-hidden relative">
                                        {selectedImage ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 truncate max-w-[300px]">{selectedImage.name}</span>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setSelectedImage(null); }}
                                                    className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-lg hover:text-red-500 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center px-10">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all mb-4">
                                                    <Paperclip size={32} />
                                                </div>
                                                <p className="font-bold text-slate-800">Choose a file or drag & drop</p>
                                                <p className="text-xs text-slate-400 mt-1 uppercase font-black tracking-widest">Image, PDF, max 5MB</p>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            name="image"
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-4.5 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="flex-[2] py-4.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* --- CHAT VIEW (TWO-PANE LAYOUT) --- */}
                    {viewMode === 'chat' && (
                        <motion.div 
                            key="chat"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[600px]"
                        >
                            {/* Left Pane: Original Ticket Details */}
                            <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <TicketIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">Original Ticket</h3>
                                            <p className="text-slate-400 text-sm font-medium italic">
                                                {format(new Date(selectedTicket?.created_at || new Date()), 'dd.M.yyyy, hh:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100 space-y-4">
                                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedTicket?.subject}</h4>
                                        <p className="text-slate-600 text-base leading-relaxed font-medium">
                                            {selectedTicket?.description || selectedTicket?.message}
                                        </p>
                                        {selectedTicket?.image && (
                                            <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200">
                                                <img 
                                                    src={selectedTicket.image.startsWith('http') ? selectedTicket.image : `${import.meta.env.VITE_API_BASE_URL}/storage/${selectedTicket.image}`} 
                                                    alt="Attached screenshot"
                                                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase">{selectedTicket?.department || 'Support'}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 uppercase">{selectedTicket?.related_service || 'Account Related'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Pane: Chat Interface */}
                            <div className="lg:col-span-8 flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                                {/* Chat Sub-header */}
                                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">
                                            DEPT: <span className="text-blue-600">{selectedTicket?.department?.toUpperCase() || 'SUPPORT'}</span>
                                        </span>
                                        <span className="hidden sm:inline">|</span>
                                        <span className="hidden sm:inline">
                                            SERVICE: <span className="text-blue-600">{selectedTicket?.related_service?.toUpperCase() || 'GENERAL'}</span>
                                        </span>
                                    </div>
                                    <span className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest", getPriorityStyles(selectedTicket?.priority || 'low'))}>
                                        {selectedTicket?.priority}
                                    </span>
                                </div>

                                {/* Messages Scroll Area */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20 custom-scrollbar">
                                    {isLoadingDetails ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-4">
                                            <Loader2 className="animate-spin text-blue-600" size={48} />
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Loading Conversation...</p>
                                        </div>
                                    ) : details?.conversations && details.conversations.length > 0 ? (
                                        details.conversations.map((msg: any) => {
                                            const isAdmin = !msg.user_id || Number(msg.user_id) === 1 || String(msg.user_id).includes('admin');
                                            return (
                                                <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isAdmin ? "mr-auto items-start" : "ml-auto items-end")}>
                                                    <div className={cn(
                                                        "p-4 md:p-6 rounded-[28px] shadow-sm text-sm md:text-base leading-relaxed font-medium transition-all group",
                                                        isAdmin ? "bg-white text-slate-800 rounded-bl-none border border-slate-100" : "bg-blue-600 text-white rounded-br-none"
                                                    )}>
                                                        {msg.message || msg.msg}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 px-2 text-[10px] font-bold text-slate-400">
                                                        <span>{format(new Date(msg.created_at), 'hh:mm a')}</span>
                                                        <span>•</span>
                                                        <span className="uppercase">{isAdmin ? 'Support Team' : 'You'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60">
                                            <MessageSquare size={48} strokeWidth={1.5} />
                                            <p className="font-bold text-sm mt-4 uppercase tracking-widest">No replies yet</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Persistent Input Area */}
                                <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your message here..."
                                            className="w-full pl-6 pr-20 py-4.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700"
                                        />
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={sendMutation.isPending || !message.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                        >
                                            {sendMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Custom Styles for Scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}} />
        </div>
    );
};

export default SupportTicketPage;

