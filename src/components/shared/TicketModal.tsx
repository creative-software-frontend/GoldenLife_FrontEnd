import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/shared/CustomSelect';
import {
    Ticket as TicketIcon,
    X,
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
    ChevronDown
} from 'lucide-react';
import useModalStore from '@/store/modalStore';
import { useTickets, useCreateTicket, useSendMessage, useTicketDetails, Ticket } from '@/hooks/useTickets';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

type ViewMode = 'list' | 'create' | 'chat';

const TicketModal = () => {
    const { isTicketModalOpen, setIsTicketModalOpen } = useModalStore();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeMobileTab, setActiveMobileTab] = useState('details'); // 'details' or 'chat'

    const currentUserId = useAppStore(state => state.studentProfile?.id || state.vendorProfile?.user?.id || 0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }; const { data: tickets, isLoading } = useTickets();
    const { data: details, isLoading: isLoadingDetails } = useTicketDetails(selectedTicket?.id || null);

    useEffect(() => {
        if (details?.conversations) {
            scrollToBottom();
        }
    }, [details?.conversations]);

    const createMutation = useCreateTicket();
    const sendMutation = useSendMessage();

    if (!isTicketModalOpen) return null;

    const handleClose = () => {
        setIsTicketModalOpen(false);
        setViewMode('list');
        setSelectedTicket(null);
        setSelectedImage(null);
    };

    const handleBack = () => {
        setViewMode('list');
        setSelectedTicket(null);
    };

    const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Fix SQL NULL error: if no image, ensure it's at least an empty string
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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-500';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={cn(
                        "relative w-full bg-[#f8f9fa] rounded-[32px] shadow-2xl overflow-hidden flex flex-col transition-all duration-300",
                        viewMode === 'chat' ? 'max-w-5xl h-[90vh] max-h-[90vh]' : 'max-w-2xl max-h-[90vh]'
                    )}
                >
                    {/* Header */}
                    <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {viewMode !== 'list' && (
                                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1">
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <TicketIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {viewMode === 'list' ? 'Support Tickets' : viewMode === 'create' ? 'Create New Ticket' : 'Ticket Discussion'}
                                </h2>
                                {viewMode === 'chat' && selectedTicket && (
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">#{selectedTicket.id} - {selectedTicket.subject}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {viewMode === 'list' && (
                                <button
                                    onClick={() => setViewMode('create')}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                >
                                    <Plus size={18} />
                                    New Ticket
                                </button>
                            )}
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className={cn(
                        "flex-1 flex flex-col bg-gray-50/50",
                        viewMode === 'chat' ? 'overflow-hidden' : 'overflow-y-auto min-h-[400px]'
                    )}>
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' && (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-4 md:p-6"
                                >
                                    {isLoading ? (
                                        /* Enhanced Responsive Skeleton */
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4].map(n => (
                                                <div key={n} className="h-20 md:h-12 bg-white rounded-2xl md:rounded-xl animate-pulse shadow-sm border border-gray-100" />
                                            ))}
                                        </div>
                                    ) : tickets?.length ? (
                                        <div className="space-y-4">
                                            {/* --- DESKTOP VIEW (Table) --- */}
                                            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                                        <thead>
                                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-500">Ticket ID</th>
                                                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-500">Subject</th>
                                                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-500">Priority</th>
                                                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-500">Status</th>
                                                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-gray-500 text-right">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {tickets.map((ticket) => (
                                                                <tr
                                                                    key={ticket.id}
                                                                    onClick={() => {
                                                                        setSelectedTicket(ticket);
                                                                        setViewMode('chat');
                                                                    }}
                                                                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                                                >
                                                                    <td className="px-6 py-4">
                                                                        <span className="text-xs font-black text-blue-600">#{ticket.id}</span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className="text-sm font-bold text-[#1a2b3b] group-hover:text-blue-600 transition-colors line-clamp-1">
                                                                            {ticket.subject}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className={cn("w-1.5 h-1.5 rounded-full",
                                                                                ticket.priority.toLowerCase() === 'high' ? 'bg-red-500' :
                                                                                    ticket.priority.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                                                            )} />
                                                                            <span className={cn("text-[11px] font-bold uppercase", getPriorityColor(ticket.priority))}>
                                                                                {ticket.priority}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className={cn("inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight", getStatusColor(ticket.status))}>
                                                                            {ticket.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <span className="text-[11px] font-bold text-gray-400 font-mono">
                                                                            {format(new Date(ticket.created_at), 'd.M.yyyy')}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* --- MOBILE VIEW (Cards) --- */}
                                            <div className="grid grid-cols-1 gap-3 md:hidden">
                                                {tickets.map((ticket) => (
                                                    <div
                                                        key={ticket.id}
                                                        onClick={() => {
                                                            setSelectedTicket(ticket);
                                                            setViewMode('chat');
                                                        }}
                                                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">#{ticket.id}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 font-mono">
                                                                {format(new Date(ticket.created_at), 'd.M.yyyy')}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-sm font-bold text-[#1a2b3b] mb-4 line-clamp-2 leading-snug">
                                                            {ticket.subject}
                                                        </h4>

                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                                    ticket.priority.toLowerCase() === 'high' ? 'bg-red-500' :
                                                                        ticket.priority.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                                                )} />
                                                                <span className={cn("text-[10px] font-black uppercase tracking-wider", getPriorityColor(ticket.priority))}>
                                                                    {ticket.priority}
                                                                </span>
                                                            </div>
                                                            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight", getStatusColor(ticket.status))}>
                                                                {ticket.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Empty State */
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 opacity-60">
                                            <TicketIcon size={48} strokeWidth={1} className="mb-4" />
                                            <p className="font-bold">No tickets found</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {viewMode === 'create' && (
                                <motion.div
                                    key="create"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-5 sm:p-8"
                                >
                                    <form onSubmit={handleCreateTicket} className="space-y-4 sm:space-y-5 px-1 sm:px-0 pb-12 sm:pb-0">

                                        {/* Dropdowns */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <CustomSelect
                                                label="Department"
                                                name="department"
                                                options={["IT Support", "Billing", "General", "Sales", "HR"]}
                                                defaultValue="IT Support"
                                            />

                                            <CustomSelect
                                                label="Priority"
                                                name="priority"
                                                options={["Low", "Medium", "High", "Urgent"]}
                                                defaultValue="Low"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Subject</label>
                                            <input
                                                name="subject"
                                                required
                                                type="text"
                                                autoComplete="off" // Add this if you want to disable browser's native autocomplete popups
                                                placeholder="Explain briefly..."
                                                className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
                                            />
                                        </div>

                                        {/* Related Service */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Related Service</label>
                                            <input
                                                name="related_service"
                                                required
                                                type="text"
                                                placeholder="e.g. Software Installation"
                                                className="w-full h-12 px-4 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                                            <textarea
                                                name="description"
                                                required
                                                rows={4}
                                                placeholder="Describe your issue in detail..."
                                                className="w-full p-4 bg-white rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-sm resize-none min-h-[100px]"
                                            ></textarea>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    name="image"
                                                    id="ticket-image"
                                                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="ticket-image"
                                                    className="flex items-center gap-3 group cursor-pointer w-full justify-center sm:justify-start"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shrink-0">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-all">
                                                            {selectedImage ? 'Image Selected' : 'Attach Image'}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">
                                                            {selectedImage ? selectedImage.name : 'Max size 5MB'}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>

                                            <button
                                                disabled={createMutation?.isPending}
                                                type="submit"
                                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                            >
                                                {createMutation?.isPending ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <Plus size={18} strokeWidth={3} />
                                                )}
                                                Create Ticket
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {viewMode === 'chat' && selectedTicket && (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex flex-col h-full bg-white overflow-hidden"
                                >
                                    {/* Ticket Info Strip */}
                                    <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between gap-4 shrink-0">
                                        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5 text-blue-600">
                                                <span className="text-gray-400">Dept:</span>
                                                {selectedTicket.department}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-blue-600">
                                                <span className="text-gray-400">Service:</span>
                                                {selectedTicket.related_service}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-sm",
                                                selectedTicket.priority.toLowerCase() === 'high' ? 'bg-red-500' : 'bg-blue-500'
                                            )}>
                                                {selectedTicket.priority}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile Tab Switcher - Only visible on small screens */}
                                    <div className="flex md:hidden border-b border-gray-100 bg-white shrink-0">
                                        <button
                                            onClick={() => setActiveMobileTab('details')}
                                            className={cn(
                                                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                                                activeMobileTab === 'details' ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
                                            )}
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => setActiveMobileTab('chat')}
                                            className={cn(
                                                "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                                                activeMobileTab === 'chat' ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"
                                            )}
                                        >
                                            Chat
                                        </button>
                                    </div>

                                    <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                                        {/* Left Panel: Original Ticket Info & Image */}
                                        {/* Logic: Hidden on mobile unless 'details' tab is active; Always block on md+ */}
                                        <div className={cn(
                                            "w-full md:w-[35%] lg:w-[40%] max-h-none md:h-full border-b md:border-b-0 md:border-r border-gray-100 bg-white overflow-y-auto shrink-0 scrollbar-none",
                                            activeMobileTab === 'details' ? "block" : "hidden md:block"
                                        )}>
                                            <div className="p-4 md:p-6 flex flex-col">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                                        <TicketIcon size={20} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-[#1a2b3b] text-sm">Original Ticket</h3>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {format(new Date(selectedTicket.created_at), 'd.M.yyyy, hh:mm a')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                                                    <p className="text-sm font-black text-[#1a2b3b] mb-3">{selectedTicket.subject}</p>
                                                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">{selectedTicket.description}</p>
                                                    {selectedTicket.image && (
                                                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex justify-center p-2">
                                                            <img
                                                                src={`https://admin.goldenlifeltd.com/uploads/ticket/${selectedTicket.image}`}
                                                                alt="attachment"
                                                                className="w-full max-w-[140px] h-auto object-contain rounded-lg"
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Panel: Chat Messages & Input */}
                                        {/* Logic: Hidden on mobile unless 'chat' tab is active; Always flex on md+ */}
                                        <div className={cn(
                                            "flex-1 flex flex-col min-h-0 bg-white",
                                            activeMobileTab === 'chat' ? "flex" : "hidden md:flex"
                                        )}>
                                            <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                                                {isLoadingDetails ? (
                                                    <div className="flex justify-center py-4">
                                                        <Loader2 className="animate-spin text-blue-600" />
                                                    </div>
                                                ) : details?.conversations.length ? (
                                                    details.conversations.map((msg) => {
                                                        const isAdmin = !msg.user_id || Number(msg.user_id) === 1;
                                                        const formattedDate = format(new Date(msg.created_at), 'd.M.yyyy, hh:mm a').toUpperCase();

                                                        return (
                                                            <div key={msg.id} className={cn("flex w-full", isAdmin ? "justify-start" : "justify-end")}>
                                                                <div className={cn("flex flex-col max-w-[85%]", isAdmin ? "items-start" : "items-end")}>
                                                                    <div className={cn(
                                                                        "p-3 px-4 rounded-3xl shadow-sm",
                                                                        isAdmin
                                                                            ? "bg-[#4d4ee2] text-white rounded-tl-none shadow-[#4d4ee2]/10"
                                                                            : "bg-blue-600 text-white rounded-tr-none shadow-blue-600/10"
                                                                    )}>
                                                                        <div className="flex items-start gap-2">
                                                                            <div className="mt-0.5 shrink-0 opacity-80">
                                                                                {isAdmin ? <ShieldCheck size={15} strokeWidth={2.5} /> : <User size={15} strokeWidth={2.5} />}
                                                                            </div>
                                                                            <div
                                                                                className="text-[13px] font-medium leading-relaxed space-y-2 [&>p]:m-0 break-words"
                                                                                dangerouslySetInnerHTML={{ __html: msg.msg }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className={cn(
                                                                        "flex items-center gap-1.5 mt-2 px-1 text-[10px] font-black uppercase tracking-widest",
                                                                        isAdmin ? "text-indigo-600" : "text-gray-400"
                                                                    )}>
                                                                        {isAdmin ? (
                                                                            <>
                                                                                <span>Admin</span>
                                                                                <span className="text-gray-400 opacity-60">·</span>
                                                                                <span className="text-gray-400 font-bold">{formattedDate}</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="text-gray-400 font-bold">{formattedDate}</span>
                                                                                <span className="text-gray-400 opacity-60">·</span>
                                                                                <span className="text-blue-600">You</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                                        <MessageSquare size={48} strokeWidth={1} className="mb-4" />
                                                        <p className="font-bold text-sm">No messages yet</p>
                                                    </div>
                                                )}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            {/* Chat Input */}
                                            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                                                <div className="relative flex items-center gap-3">
                                                    <input
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        type="text"
                                                        placeholder="Type your message..."
                                                        className="flex-1 h-12 pl-5 pr-14 bg-gray-50 rounded-2xl border border-transparent focus:border-blue-500 outline-none font-medium text-sm transition-all shadow-inner"
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        disabled={!message.trim() || sendMutation.isPending}
                                                        className="absolute right-1.5 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all"
                                                    >
                                                        {sendMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TicketModal;