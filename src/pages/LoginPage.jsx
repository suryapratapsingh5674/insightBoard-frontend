import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Shield,
  User,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { loginApi } from '../services/auth.api';
import { setCredentials } from '../features/auth/authSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@insightboard.io');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to destination or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await loginApi({ email, password });
      if (response?.data) {
        dispatch(
          setCredentials({
            user: response.data.user,
            accessToken: response.data.accessToken,
          })
        );
        const origin = location.state?.from?.pathname || '/';
        navigate(origin, { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err.friendlyMessage || 'Unable to sign in. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Welcome to InsightBoard
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your business analytics workspace
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill Demo Accounts */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              Quick-Fill Seeded Demo Roles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@insightboard.io')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors text-left"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Admin</span>
                <span className="text-[9px] text-slate-400">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('analyst@insightboard.io')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-left"
              >
                <Shield className="h-4 w-4 text-blue-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Analyst</span>
                <span className="text-[9px] text-slate-400">Operations</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('viewer@insightboard.io')}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
              >
                <User className="h-4 w-4 text-slate-600 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Viewer</span>
                <span className="text-[9px] text-slate-400">Read-Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          InsightBoard • Student-Built MERN SaaS Analytics Project
        </p>
      </div>
    </div>
  );
}
