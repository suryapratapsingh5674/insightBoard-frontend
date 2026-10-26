import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  X,
  Lock,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../features/ui/uiSlice';
import { logoutUser } from '../../features/auth/authSlice';
import { logoutApi } from '../../services/auth.api';
import SettingsModal from '../common/SettingsModal';
import DocumentationModal from '../common/DocumentationModal';

export default function Sidebar() {
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const navGroups = [
    {
      title: 'Menu',
      items: [
        { name: 'Dashboard', to: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Management',
      items: [
        { name: 'Customers', to: '/customers', icon: Users, badge: '12' },
        { name: 'Products', to: '/products', icon: Package, badge: '10' },
        { name: 'Orders', to: '/orders', icon: ShoppingCart, badge: '50' },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          name: 'Team & Roles',
          to: '/team',
          icon: ShieldCheck,
          roleRequired: 'Admin',
          locked: !isAdmin,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-100 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900">InsightBoard</span>
              <span className="ml-1.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                SaaS
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          dispatch(setSidebarOpen(false));
                        }
                      }}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        } ${item.locked ? 'opacity-70' : ''}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.locked && (
                              <Lock className="h-3 w-3 text-slate-400" title="Admin access only" />
                            )}
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  isActive
                                    ? 'bg-slate-800 text-slate-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.roleRequired && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                  isActive
                                    ? 'bg-indigo-500/30 text-indigo-200'
                                    : 'bg-indigo-50 text-indigo-700'
                                }`}
                              >
                                {item.roleRequired}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* General Section */}
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              General
            </p>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                onClick={() => setIsDocOpen(true)}
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Documentation</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Workspace & Authenticated User Profile Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 hover:bg-slate-100/80 transition-colors">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer group"
              title="Manage Account & Settings"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-semibold text-indigo-700 text-xs group-hover:bg-indigo-200 transition-colors">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {user?.name || 'Authenticated User'}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {user?.workspace?.name || 'Acme Retail Corp'} • {user?.role || 'Viewer'}
                </p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 transition-colors shadow-none hover:shadow-sm cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        user={user}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={isDocOpen}
        onClose={() => setIsDocOpen(false)}
      />
    </>
  );
}
