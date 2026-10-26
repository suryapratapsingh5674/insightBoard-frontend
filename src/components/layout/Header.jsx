import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '../../services/health.api';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationsPopover from './NotificationsPopover';

export default function Header() {
  const dispatch = useDispatch();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Global Ctrl + K / Cmd + K keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // TanStack Query to verify backend connection in real-time
  const { data: healthData, isError, isLoading, refetch } = useQuery({
    queryKey: ['healthStatus'],
    queryFn: getHealthStatus,
    refetchInterval: 30000,
    retry: 1,
  });

  const handleHealthClick = () => {
    refetch();
    const statusText = isError
      ? 'Backend API offline or database disconnected.'
      : 'Express API and MongoDB connection are healthy (200 OK).';
    alert(`System Health Status: ${statusText}`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
        {/* Left: Mobile hamburger & Interactive Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Interactive Global Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="relative w-full max-w-md hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-sm text-slate-400 hover:bg-white hover:border-slate-300 hover:text-slate-600 transition-all text-left cursor-pointer shadow-2xs"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <span className="text-xs sm:text-sm">Search customers, products, or orders...</span>
            <div className="ml-auto flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
              <span className="text-xs">⌘</span>K
            </div>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* API Backend Health indicator (Interactive) */}
          <button
            type="button"
            onClick={handleHealthClick}
            className={`hidden md:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border cursor-pointer transition-colors ${
              isLoading
                ? 'border-slate-200 bg-slate-50 text-slate-500'
                : isError
                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Click to check live backend and database connectivity"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLoading
                  ? 'bg-slate-400 animate-pulse'
                  : isError
                  ? 'bg-rose-500'
                  : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span>{isLoading ? 'Checking API...' : isError ? 'API Offline' : 'API Online'}</span>
          </button>


          {/* Notifications Button (Interactive) */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
            title="Notifications & Activity"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          </button>
        </div>
      </header>

      {/* Global Search & Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
