import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function RootErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred while loading this page.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 mb-2">
        Error {errorStatus}
      </span>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Something went wrong
      </h1>
      
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        {errorMessage}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reload Page</span>
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
