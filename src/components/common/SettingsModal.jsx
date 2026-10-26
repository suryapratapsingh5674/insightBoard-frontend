import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  Building,
  KeyRound,
  Shield,
  Server,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Clock,
  Coins,
} from 'lucide-react';
import { updateUserProfileApi } from '../../services/users.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';

export default function SettingsModal({ isOpen, user, onClose }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'workspace' | 'system'

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {};
    if (name.trim() && name.trim() !== user.name) {
      payload.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current password to set a new password');
        return;
      }
      if (newPassword.length < 8) {
        setErrorMsg('New password must be at least 8 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirmation do not match');
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setErrorMsg('No changes detected');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateUserProfileApi(payload);
      setSuccessMsg('Settings updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (res?.data?.user) {
        dispatch(setCredentials({ user: res.data.user }));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Workspace & Account Settings</h2>
              <p className="text-xs text-slate-500">
                Manage organization configurations, identity, and credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 pt-3 pb-2">
          {[
            { id: 'account', label: 'Account & Security', icon: User },
            { id: 'workspace', label: 'Workspace Details', icon: Building },
            { id: 'system', label: 'System & Infrastructure', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-600">
          {/* TAB 1: ACCOUNT & SECURITY */}
          {activeTab === 'account' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Work Email</span>
                  <span className="font-semibold text-slate-900 font-mono">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Workspace Role</span>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  Change Password
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Account Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: WORKSPACE DETAILS */}
          {activeTab === 'workspace' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Acme Retail Corp</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Slug: acme-retail</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-bold border border-indigo-200/60">
                    Enterprise Tier
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Base Currency</span>
                      <span className="font-semibold text-slate-800">INR (₹) Minor Units (Paise)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Primary Timezone</span>
                      <span className="font-semibold text-slate-800">Asia/Kolkata (IST)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] text-amber-800">
                  <p className="font-semibold">Tenant Data Isolation Active</p>
                  <p className="mt-0.5 text-amber-700">
                    All customers, catalog products, transactions, and metrics are strictly quarantined to Workspace ID: <code className="font-mono bg-white px-1 py-0.5 rounded text-amber-900">acme-retail</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM & INFRASTRUCTURE */}
          {activeTab === 'system' && (
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Server className="h-4 w-4 text-indigo-600" />
                  Runtime Health & Security Controls
                </div>

                <div className="space-y-2 text-[11px] font-mono text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Environment:</span>
                    <span className="font-semibold text-slate-800">Development / Production Ready</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">API Host:</span>
                    <span className="font-semibold text-slate-800">http://localhost:5000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Rate Limiter:</span>
                    <span className="font-semibold text-emerald-600">Active (1000 req / 15m)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Security Headers:</span>
                    <span className="font-semibold text-indigo-600">Helmet v8.0 Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
