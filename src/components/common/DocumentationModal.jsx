import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Shield,
  Layers,
  Code2,
  Database,
  Coins,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function DocumentationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'security' | 'rbac' | 'api'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Documentation</h2>
              <p className="text-xs text-slate-500">
                Architectural patterns, security models, and API reference
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
        <div className="flex items-center gap-2 border-b border-slate-100 pt-3 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Architecture & Stack', icon: Layers },
            { id: 'security', label: 'Security & Math', icon: Shield },
            { id: 'rbac', label: 'RBAC Matrix', icon: Lock },
            { id: 'api', label: 'API Reference', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-600">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1">InsightBoard MERN Architecture</h3>
                <p className="text-slate-600 leading-relaxed">
                  InsightBoard is an enterprise-grade SaaS sales analytics and management dashboard. Built using a modular multi-tier architecture, it separates client-owned UI state from server data synchronization and delegates heavy financial math to optimized database pipelines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    Frontend Stack
                  </div>
                  <ul className="space-y-1 text-slate-500 text-[11px]">
                    <li>• <strong>React 19 + Vite 8</strong>: Ultra-fast module bundling</li>
                    <li>• <strong>React Router Data Layer</strong>: createBrowserRouter API</li>
                    <li>• <strong>TanStack Query v5</strong>: Server state cache & invalidation</li>
                    <li>• <strong>Redux Toolkit</strong>: Client UI drawer & filter state</li>
                    <li>• <strong>Tailwind CSS v3</strong>: Custom SaaS design system</li>
                    <li>• <strong>Recharts</strong>: Time-series revenue visualization</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                    <Database className="h-4 w-4 text-emerald-600" />
                    Backend & Storage
                  </div>
                  <ul className="space-y-1 text-slate-500 text-[11px]">
                    <li>• <strong>Node.js & Express</strong>: Native ES Modules architecture</li>
                    <li>• <strong>MongoDB & Mongoose 9</strong>: Compound indexed schemas</li>
                    <li>• <strong>Helmet & Rate Limit</strong>: Defensive HTTP security</li>
                    <li>• <strong>Bcrypt.js (Cost 12)</strong>: Salted password hashing</li>
                    <li>• <strong>Dual-Token Auth</strong>: 15m JWT + 7d rotating cookie</li>
                    <li>• <strong>Integer Paise Math</strong>: Zero floating-point drift</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & MATH */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <Coins className="h-4 w-4 text-emerald-600" />
                  Exact Integer Currency Architecture (Zero Float Drift)
                </div>
                <p className="mt-1 text-emerald-800 leading-relaxed text-[11px]">
                  Binary IEEE 754 floating point numbers cannot accurately represent decimals (<code className="font-mono bg-white/60 px-1 py-0.5 rounded">0.1 + 0.2 = 0.30000000000000004</code>). InsightBoard stores all monetary amounts in their smallest minor unit (<strong>paise</strong>, where ₹1 = 100 paise). The backend performs exact integer arithmetic, converting to rupees only for UI presentation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
                <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                  <Lock className="h-4 w-4 text-indigo-600" />
                  Dual-Token Rotation & Reuse Detection
                </div>
                <p className="mt-1 text-indigo-800 leading-relaxed text-[11px]">
                  Access tokens expire after 15 minutes and live solely in memory. Refresh tokens are stored in HTTP-only, SameSite cookies and hashed in MongoDB with SHA-256. If an invalidated refresh token is reused, the backend detects the breach and terminates the entire session family immediately.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Shield className="h-4 w-4 text-slate-700" />
                  Sole Administrator Safety Invariant
                </div>
                <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">
                  To prevent organizations from becoming permanently orphaned, the user controller counts active workspace administrators before applying any role change or deactivation. If only one Admin remains, demotions and self-deactivations are rejected with <code className="font-mono bg-white px-1 py-0.5 rounded">400 Bad Request</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div className="space-y-3">
              <p className="text-slate-500">
                Workspace authorizations are enforced strictly at the API layer via <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700">requireRole()</code> middleware.
              </p>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">System Permission</th>
                      <th className="py-2.5 px-3 text-center text-indigo-700">Admin</th>
                      <th className="py-2.5 px-3 text-center text-blue-700">Analyst</th>
                      <th className="py-2.5 px-3 text-center text-slate-700">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">View Analytics & Dashboard</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">View Customers, Products, Orders</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">Create & Edit Customers / Products</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">Create Orders & Update Status</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">Archive / Restore Records</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-800">Invite Members & Change Roles</td>
                      <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                      <td className="py-2 px-3 text-center text-rose-500 font-bold">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: API REFERENCE */}
          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Endpoint</th>
                      <th className="py-2.5 px-3">Allowed Roles</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-2 px-3 text-blue-600 font-bold">POST</td>
                      <td className="py-2 px-3 text-slate-800">/api/auth/login</td>
                      <td className="py-2 px-3 text-slate-500">Public</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">Issue access token & cookie</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                      <td className="py-2 px-3 text-slate-800">/api/dashboard/stats</td>
                      <td className="py-2 px-3 text-slate-500">All Roles</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">KPIs & status distribution</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-emerald-600 font-bold">GET</td>
                      <td className="py-2 px-3 text-slate-800">/api/customers</td>
                      <td className="py-2 px-3 text-slate-500">All Roles</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">Paginated customer roster</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-blue-600 font-bold">POST</td>
                      <td className="py-2 px-3 text-slate-800">/api/orders</td>
                      <td className="py-2 px-3 text-indigo-600">Admin, Analyst</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">Server snapshot order receipt</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-amber-600 font-bold">PATCH</td>
                      <td className="py-2 px-3 text-slate-800">/api/users/:id/role</td>
                      <td className="py-2 px-3 text-indigo-600">Admin</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">Modify member permissions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            For interview preparation, see <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">INTERVIEW_DEFENSE.md</code>
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
