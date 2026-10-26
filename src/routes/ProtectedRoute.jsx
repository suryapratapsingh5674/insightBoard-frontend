import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show clean spinner while checking session cookie on initial load
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-medium text-slate-500">Restoring session...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role authorization check (RBAC)
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 shadow-sm">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 mb-2">
          403 Forbidden
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md">
          Your current role (<span className="font-semibold text-slate-700">{user?.role}</span>) does not have permission to view or manage this workspace area.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
