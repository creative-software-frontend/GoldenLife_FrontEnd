import React, { useRef, useEffect } from 'react';
import { Bell, Package, CheckCheck, Wallet, Info, BellOff } from 'lucide-react';
import { useVendorNotifications, NotificationItem } from '@/hooks/useVendorNotifications';

interface VendorNotificationBellProps {
  baseURL: string;
  token: string | null;
}

const VendorNotificationBell = ({ baseURL, token }: VendorNotificationBellProps) => {
  const {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    syncing,
    markAsRead,
    markAllAsRead,
    formatDate,
    isUnread,
  } = useVendorNotifications(baseURL, token);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the dropdown container AND outside the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add listener only when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Close dropdown when pressing ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, setIsOpen]);

  // Toggle dropdown (prevent event bubbling)
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getIcon = (notif: NotificationItem) => {
    const base = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
    const title = notif.data.title?.toLowerCase() || '';
    const type = notif.type?.toLowerCase() || '';

    if (title.includes('order') || type.includes('orderstatus')) return <Package className={`${base} text-blue-500`} />;
    if (title.includes('transaction') || type.includes('transactionstatus')) return <Wallet className={`${base} text-emerald-500`} />;
    if (title.includes('payment') || type.includes('payment')) return <Wallet className={`${base} text-green-500`} />;
    return <Info className={`${base} text-slate-500`} />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
            ? 'bg-primary-light/10 text-primary-light shadow-inner'
            : 'bg-white text-slate-500 hover:text-primary-light hover:bg-slate-50 shadow-sm border border-slate-200'
          }`}
        disabled={syncing}
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

        {syncing && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-full">
            <div className="w-4 h-4 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-light/10 text-primary-light text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={syncing}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4 text-slate-400" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-slate-100 p-3 rounded-full mb-3">
                  <BellOff className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium text-base">No notifications yet</p>
                <p className="text-slate-400 text-sm mt-1">We'll notify you when something new arrives.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => {
                  const unread = isUnread(notif);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => unread && !syncing && markAsRead(notif.id)}
                      className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${unread
                          ? 'bg-primary-light/5 hover:bg-primary-light/10 border-l-4 border-primary-light'
                          : 'bg-white hover:bg-slate-50 border-l-4 border-transparent opacity-80'
                        } ${syncing ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <div className="p-2 sm:p-2.5 rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
                        {getIcon(notif)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm ${unread ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'
                            }`}
                        >
                          {notif.data.title}
                        </p>
                        <p
                          className={`text-[13px] leading-relaxed line-clamp-2 ${unread ? 'text-slate-700' : 'text-slate-500'
                            }`}
                        >
                          {notif.data.message}
                        </p>
                        <p className="text-[11px] text-slate-400 pt-0.5">
                          {formatDate(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorNotificationBell;
