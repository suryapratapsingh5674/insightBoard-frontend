import React, { useState, useEffect } from 'react';
import { X, Shield, Loader2, AlertTriangle } from 'lucide-react';

export default function EditRoleModal({
  isOpen,
  member,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [selectedRole, setSelectedRole] = useState('Viewer');

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role || 'Viewer');
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: member._id, role: selectedRole });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Modify Member Role</h2>
              <p className="text-xs text-slate-500">
                Update authorizations for <span className="font-semibold text-slate-700">{member.name}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/80">
            <span className="block font-semibold text-slate-800">{member.name}</span>
            <span className="text-slate-400">{member.email}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Viewer">Viewer (Read-only analytics and records)</option>
              <option value="Analyst">Analyst (Manage customers, products, and orders)</option>
              <option value="Admin">Admin (Full workspace administration and team controls)</option>
            </select>
          </div>

          {member.role === 'Admin' && selectedRole !== 'Admin' && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Warning: Demoting an administrator removes team management privileges. The backend requires at least one active Admin in the workspace.
              </span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedRole === member.role}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
