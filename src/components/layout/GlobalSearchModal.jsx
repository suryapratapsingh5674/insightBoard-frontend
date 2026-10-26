import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Users,
  Package,
  ShoppingCart,
  LayoutDashboard,
  Shield,
  ArrowRight,
  Loader2,
  CornerDownLeft,
} from 'lucide-react';
import { getCustomersApi } from '../../services/customers.api';
import { getProductsApi } from '../../services/products.api';
import { getOrdersApi } from '../../services/orders.api';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    customers: [],
    products: [],
    orders: [],
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ customers: [], products: [], orders: [] });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced multi-entity search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ customers: [], products: [], orders: [] });
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [custRes, prodRes, orderRes] = await Promise.all([
          getCustomersApi({ search: query.trim(), limit: 4 }),
          getProductsApi({ search: query.trim(), limit: 4 }),
          getOrdersApi({ search: query.trim(), limit: 4 }),
        ]);

        setResults({
          customers: custRes?.data?.customers || [],
          products: prodRes?.data?.products || [],
          orders: orderRes?.data?.orders || [],
        });
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  const hasResults =
    results.customers.length > 0 ||
    results.products.length > 0 ||
    results.orders.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search customers, products, or orders..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-indigo-600 mr-2 shrink-0" />}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results / Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Nav when query is empty */}
          {!query.trim() && (
            <div className="space-y-1">
              <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Quick Navigation
              </span>
              <button
                onClick={() => handleSelect('/')}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <LayoutDashboard className="h-4 w-4 text-slate-400" />
                  <span>Dashboard (Sales Overview)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelect('/customers')}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>Customers Directory</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelect('/products')}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <Package className="h-4 w-4 text-slate-400" />
                  <span>Product Catalog</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelect('/orders')}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <ShoppingCart className="h-4 w-4 text-slate-400" />
                  <span>Orders Management</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleSelect('/team')}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 font-medium text-slate-700">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>Team & Permissions</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          )}

          {/* Search Query Results */}
          {query.trim() && !isLoading && !hasResults && (
            <div className="py-8 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching records found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Try searching by customer name, order number, or product SKU
              </p>
            </div>
          )}

          {query.trim() && hasResults && (
            <div className="space-y-4">
              {/* Customers Match */}
              {results.customers.length > 0 && (
                <div>
                  <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Customers ({results.customers.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {results.customers.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => handleSelect('/customers')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.email} {c.company ? `• ${c.company}` : ''}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          Customer
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Match */}
              {results.products.length > 0 && (
                <div>
                  <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Products ({results.products.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {results.products.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => handleSelect('/products')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">{p.sku} • ₹{(p.unitPricePaise / 100).toFixed(2)}</p>
                        </div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                          Product
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Match */}
              {results.orders.length > 0 && (
                <div>
                  <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Orders ({results.orders.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {results.orders.map((o) => (
                      <button
                        key={o._id}
                        onClick={() => handleSelect('/orders')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-semibold font-mono text-slate-800">{o.orderNumber}</p>
                          <p className="text-[11px] text-slate-400">
                            {o.customerId?.name || 'Customer'} • ₹{(o.totalAmountPaise / 100).toFixed(2)} • {o.status}
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono capitalize">
                          {o.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 px-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrows or click to jump</span>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              Esc
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
