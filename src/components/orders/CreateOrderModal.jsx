import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  Package,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export default function CreateOrderModal({
  isOpen,
  customers = [],
  products = [],
  isSubmitting = false,
  error = '',
  onClose,
  onSubmit,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderStatus, setOrderStatus] = useState('pending');
  const [items, setItems] = useState([
    { productId: '', quantity: 1 },
  ]);

  // Set default customer and product when opened
  useEffect(() => {
    if (isOpen) {
      if (customers.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(customers[0]._id);
      }
      if (products.length > 0) {
        setItems([{ productId: products[0]._id, quantity: 1 }]);
      }
      setOrderStatus('pending');
    }
  }, [isOpen, customers, products]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const firstAvailableProduct = products[0]?._id || '';
    setItems((prev) => [...prev, { productId: firstAvailableProduct, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          [field]: field === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value,
        };
      })
    );
  };

  // Calculate live preview totals (in paise)
  const productMap = new Map(products.map((p) => [p._id, p]));

  let totalPreviewPaise = 0;
  const computedItems = items.map((item) => {
    const prod = productMap.get(item.productId);
    const unitPricePaise = prod ? prod.unitPricePaise : 0;
    const subtotalPaise = unitPricePaise * (item.quantity || 1);
    totalPreviewPaise += subtotalPaise;
    return {
      ...item,
      product: prod,
      unitPricePaise,
      subtotalPaise,
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert('Please select a customer');
      return;
    }
    if (items.length === 0 || items.some((it) => !it.productId || it.quantity < 1)) {
      alert('Please select valid products and positive quantities for all line items');
      return;
    }

    onSubmit({
      customerId: selectedCustomerId,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
      status: orderStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Order</h2>
              <p className="text-xs text-slate-500">
                Server computes price snapshots and totals in integer paise
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

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Customer Selection & Initial Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                {customers.length === 0 ? (
                  <option value="">No active customers found</option>
                ) : (
                  customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.company ? `(${c.company})` : ''} - {c.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Initial Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Order Line Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2.5">
              {computedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-slate-50/50"
                >
                  {/* Product Dropdown */}
                  <div className="w-full sm:flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.sku}) - ₹{(p.unitPricePaise / 100).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="w-full sm:w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 text-center focus:border-indigo-500 focus:outline-none"
                      placeholder="Qty"
                      required
                    />
                  </div>

                  {/* Subtotal Preview */}
                  <div className="w-full sm:w-32 text-right font-mono text-xs font-semibold text-slate-700">
                    ₹{(item.subtotalPaise / 100).toFixed(2)}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price Snapshot Trust Notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">Server-Side Price Integrity</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Client prices are for visual preview only. When submitted, the backend verifies active product prices directly from the database and snapshots them into the order receipt using integer paise minor units.
              </p>
            </div>
          </div>

          {/* Total Preview Card */}
          <div className="rounded-xl bg-slate-900 text-white p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Total</span>
              <p className="text-xl font-bold font-mono">
                ₹{(totalPreviewPaise / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span>{items.length} line {items.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
        </form>

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
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || products.length === 0 || customers.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Confirm & Create Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
