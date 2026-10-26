import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ShoppingCart,
  UserPlus,
  ShieldAlert,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';

export default function NotificationsPopover({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Transaction Settled',
      message: 'Order ORD-878949 was completed for ₹49,995.00',
      time: '3m ago',
      read: false,
      link: '/orders',
    },
    {
      id: 2,
      type: 'team',
      title: 'Workspace Member Added',
      message: 'Jordan Sparks joined as Analyst',
      time: '25m ago',
      read: false,
      link: '/team',
    },
    {
      id: 3,
      type: 'system',
      title: 'System Health Check Passed',
      message: 'MongoDB replica connected, dual-token rotation active',
      time: '1h ago',
      read: true,
      link: '/',
    },
    {
      id: 4,
      type: 'customer',
      title: 'New Enterprise Client Profile',
      message: 'Quantum Logic Systems profile verified',
      time: '2h ago',
      read: true,
      link: '/customers',
    },
  ]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (link) => {
    onClose();
    if (link) navigate(link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6 p-4 bg-transparent"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-xs">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-50 text-indigo-700 px-1.5 py-0.5 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n.link)}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer text-xs ${
                !n.read ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  n.type === 'order'
                    ? 'bg-emerald-50 text-emerald-600'
                    : n.type === 'team'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {n.type === 'order' ? (
                  <ShoppingCart className="h-4 w-4" />
                ) : n.type === 'team' ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-semibold text-slate-900 truncate">{n.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
              </div>
              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/30 text-center">
          <span className="text-[10px] text-slate-400">
            Real-time workspace activity feed
          </span>
        </div>
      </div>
    </div>
  );
}
