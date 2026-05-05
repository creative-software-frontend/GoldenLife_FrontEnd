import React, { useState, useRef, useEffect } from 'react';
import { Bell, Package, CheckCheck, Wallet, Info, BellOff } from 'lucide-react';
import { useInstructorNotifications, NotificationItem } from '@/hooks/useInstructorNotifications';
import { motion, AnimatePresence } from 'framer-motion';

const InstructorNotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        isNotificationsLoading,
        markAsRead,
        markAllAsRead,
        isMarkingAllAsRead,
        refetchNotifications
    } = useInstructorNotifications();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown when pressing ESC key
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen]);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
        if (!isOpen) {
            refetchNotifications();
        }
    };

    const getIcon = (notif: NotificationItem) => {
        const base = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
        const title = notif.data.title?.toLowerCase() || '';
        const type = notif.type?.toLowerCase() || '';

        if (title.includes('order') || type.includes('orderstatus')) return <Package className={`${base} text-indigo-500`} />;
        if (title.includes('transaction') || type.includes('transactionstatus') || title.includes('wallet')) return <Wallet className={`${base} text-emerald-500`} />;
        if (title.includes('payment') || type.includes('payment')) return <Wallet className={`${base} text-amber-500`} />;
        return <Info className={`${base} text-slate-500`} />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group ${isOpen
                        ? 'bg-indigo-50 text-indigo-600 shadow-inner'
                        : 'bg-white text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
                    }`}
            >
                <Bell className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={2.5} />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, originX: '100%', originY: '0%' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[22rem] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden z-50 origin-top-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider">
                                        {unreadCount} NEW
                                    </span>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    disabled={isMarkingAllAsRead}
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors uppercase tracking-wider disabled:opacity-50"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notification list */}
                        <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {isNotificationsLoading && notifications.length === 0 ? (
                                <div className="space-y-2 p-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl animate-pulse">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                                <div className="h-3 bg-slate-200 rounded w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <BellOff className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="text-slate-800 font-bold text-base">All caught up!</h4>
                                    <p className="text-slate-400 text-sm mt-1">
                                        No new notifications at the moment.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {notifications.map((notif) => {
                                        const unread = !notif.read_at;
                                        return (
                                            <div
                                                key={notif.id}
                                                onClick={() => unread && markAsRead(notif.id)}
                                                className={`group relative flex items-start gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${unread
                                                        ? 'bg-indigo-50/50 hover:bg-indigo-50 border-l-4 border-indigo-500'
                                                        : 'bg-white hover:bg-slate-50 border-l-4 border-transparent opacity-80'
                                                    }`}
                                            >
                                                <div className={`p-2.5 rounded-xl shrink-0 shadow-sm border transition-all duration-300 group-hover:shadow-md ${unread
                                                        ? 'bg-white border-indigo-100'
                                                        : 'bg-slate-50 border-slate-100'
                                                    }`}>
                                                    {getIcon(notif)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h5 className={`text-[13px] leading-tight truncate ${unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                                                            }`}>
                                                            {notif.data.title}
                                                        </h5>
                                                        {unread && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                                                    </div>
                                                    <p className={`text-[12px] leading-relaxed line-clamp-2 ${unread ? 'text-slate-700' : 'text-slate-500'
                                                        }`}>
                                                        {notif.data.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {formatDate(notif.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstructorNotificationBell;
