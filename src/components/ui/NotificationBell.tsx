"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, Package, CheckCheck, Wallet, Users, Info, BellOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'react-toastify';

interface NotificationBellProps {
    token: string;
}

const NotificationBell = ({ token }: NotificationBellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Store data & actions
    const notifications = useAppStore(s => s.notifications);
    const unreadCount = useAppStore(s => s.unreadCount);
    const isNotificationLoading = useAppStore(s => s.isNotificationLoading);
    const isNotificationFetched = useAppStore(s => s.isNotificationFetched);
    
    const fetchNotifications = useAppStore(s => s.fetchNotifications);
    const pollUnreadCount = useAppStore(s => s.pollUnreadCount);
    const markAsRead = useAppStore(s => s.markAsRead);
    const markAllAsRead = useAppStore(s => s.markAllAsRead);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial Fetch & Sync on Open
    useEffect(() => {
        if (token) {
            fetchNotifications(true); 
        }
    }, [token, fetchNotifications]);

    useEffect(() => {
        if (isOpen && token) {
            fetchNotifications(true);
        }
    }, [isOpen, token, fetchNotifications]);

    // Background Polling
    useEffect(() => {
        if (!token) return;
        
        // Fast poll when open, slow when closed
        const intervalMs = isOpen ? 5000 : 15000;
        const interval = setInterval(() => {
            if (isOpen) {
                fetchNotifications(true);
            } else {
                pollUnreadCount();
            }
        }, intervalMs);
        
        return () => clearInterval(interval);
    }, [token, isOpen, fetchNotifications, pollUnreadCount]);

    // Helpers
    const getNotificationIcon = (notif: any) => {
        const base = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
        const title = notif.data?.title?.toLowerCase() || '';
        const type = notif.type?.toLowerCase() || '';

        if (title.includes('order') || type.includes('orderstatus')) {
            return <Package className={`${base} text-blue-500`} />;
        }
        if (title.includes('transaction') || type.includes('transactionstatus') || title.includes('wallet')) {
            return <Wallet className={`${base} text-emerald-500`} />;
        }
        if (title.includes('referral') || type.includes('referralbonus') || title.includes('affiliate')) {
            return <Users className={`${base} text-purple-500`} />;
        }
        return <Info className={`${base} text-slate-500`} />;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'Just now';
        }
    };

    const isInitialLoading = isNotificationLoading && !isNotificationFetched;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group ${
                    isOpen
                        ? 'bg-emerald-100 text-emerald-600 shadow-inner'
                        : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm border border-slate-200'
                }`}
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" strokeWidth={2.5} />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[24rem] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 origin-top-right">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2.5">
                            <h3 className="font-black text-slate-800 text-sm sm:text-base tracking-tight">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                                    {unreadCount} NEW
                                </span>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                            >
                                <CheckCheck className="w-3.5 h-3.5" strokeWidth={3} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Scrollable Container */}
                    <div className="max-h-[60vh] sm:max-h-[28rem] overflow-y-auto p-2.5 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        
                        {/* Initial Loading Skeletons */}
                        {isInitialLoading ? (
                            <div className="space-y-2 p-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-2xl animate-pulse">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                                            <div className="h-3 bg-slate-200 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            /* Rejuvenated Empty State */
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                <div className="bg-slate-50 p-6 rounded-[2rem] mb-5 border border-slate-100 shadow-inner">
                                    <BellOff className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-slate-800 font-black text-lg tracking-tight">Inbox is clean!</h4>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                    No notifications at the moment. Check back later for updates.
                                </p>
                            </div>
                        ) : (
                            /* Notification List Items */
                            notifications.map((notif) => {
                                const unread = !notif.read_at;
                                return (
                                    <div
                                        key={notif.id}
                                        onClick={() => unread && markAsRead(notif.id)}
                                        className={`group relative flex items-start gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                                            unread
                                                ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100/60 hover:border-emerald-200'
                                                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <div className={`p-2.5 rounded-2xl shrink-0 shadow-sm border transition-all duration-300 group-hover:shadow-md ${
                                            unread 
                                                ? 'bg-white border-emerald-100' 
                                                : 'bg-slate-50 border-slate-100'
                                        }`}>
                                            {getNotificationIcon(notif)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h5 className={`text-[13px] leading-tight truncate ${
                                                    unread ? 'font-black text-slate-900' : 'font-bold text-slate-700'
                                                }`}>
                                                    {notif.data?.title || 'System Update'}
                                                </h5>
                                                {unread && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                                            </div>
                                            <p className={`text-[12px] leading-relaxed line-clamp-2 ${
                                                unread ? 'text-slate-700 font-medium' : 'text-slate-500'
                                            }`}>
                                                {notif.data?.message || 'New activity in your account.'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {formatDate(notif.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;