import React from 'react';
import {
  X,
  ShoppingCart,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Receipt,
  Shield,
} from 'lucide-react';

export default function OrderDetailsModal({
  isOpen,
  order = null,
  onClose,
  onUpdateStatus,
  isUpdatingStatus = false,
  userRole = 'Viewer',
}) {
  if (!isOpen || !order) return null;

  const canEditStatus = userRole === 'Admin' || userRole === 'Analyst';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Pending
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Cancelled
          </span>
        );
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalRupees = (order.totalAmountPaise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-mono text-slate-900">
                  {order.orderNumber}
                </h2>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formattedDate}</span>
                {order.createdBy && (
                  <>
                    <span>•</span>
                    <span>Created by {order.createdBy.name} ({order.createdBy.role})</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Customer Details Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Name</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {order.customerId?.name || 'Unknown Customer'}
                </span>
                {order.customerId?.company && (
                  <span className="flex items-center gap-1 text-slate-500 mt-0.5">
                    <Building className="h-3 w-3" />
                    {order.customerId.company}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {order.customerId?.email && (
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {order.customerId.email}
                  </span>
                )}
                {order.customerId?.phone && (
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {order.customerId.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Snapshot Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" />
              Order Line Items Snapshot
            </h3>
            <div className="rounded-xl border border-slate-200/80 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200/80 font-semibold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Item & SKU</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="font-mono text-[11px] text-slate-400">{item.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ₹{(item.unitPricePaise / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ₹{(item.subtotalPaise / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Minor Unit Explanation */}
          <div className="rounded-xl bg-slate-900 text-white p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Amount</span>
              <p className="text-2xl font-bold font-mono">₹{totalRupees}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span>{order.totalAmountPaise.toLocaleString('en-IN')} minor units (paise)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Exact integer math, zero float drift</p>
            </div>
          </div>

          {/* Status Update Actions */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Update Order Status
            </label>
            {canEditStatus ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order._id, 'paid')}
                  disabled={isUpdatingStatus || order.status === 'paid'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                >
                  {isUpdatingStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Mark as Paid
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order._id, 'pending')}
                  disabled={isUpdatingStatus || order.status === 'pending'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-40 transition-colors"
                >
                  {isUpdatingStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Clock className="h-3.5 w-3.5" />}
                  Mark as Pending
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStatus(order._id, 'cancelled')}
                  disabled={isUpdatingStatus || order.status === 'cancelled'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition-colors"
                >
                  {isUpdatingStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Mark as Cancelled
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                <span>Viewer role has read-only permission. Order status cannot be modified.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
