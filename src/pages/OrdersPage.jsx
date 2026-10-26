import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  ShoppingCart,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ShieldAlert,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import {
  getOrdersApi,
  createOrderApi,
  updateOrderStatusApi,
} from '../services/orders.api';
import { getCustomersApi } from '../services/customers.api';
import { getProductsApi } from '../services/products.api';
import CreateOrderModal from '../components/orders/CreateOrderModal';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const canCreate = user?.role === 'Admin' || user?.role === 'Analyst';

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'paid' | 'pending' | 'cancelled'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalError, setCreateModalError] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);

  // Fetch Orders
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'orders',
      { page, search: debouncedSearch, status: statusFilter, sortBy, sortOrder },
    ],
    queryFn: () =>
      getOrdersApi({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        sortBy,
        sortOrder,
      }),
  });

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Fetch active customers and products for the create modal
  const { data: customersData } = useQuery({
    queryKey: ['customers', 'active-list'],
    queryFn: () => getCustomersApi({ limit: 100, status: 'active' }),
    enabled: isCreateModalOpen,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 'active-list'],
    queryFn: () => getProductsApi({ limit: 100, status: 'active' }),
    enabled: isCreateModalOpen,
  });

  const activeCustomers = customersData?.data?.customers || [];
  const activeProducts = productsData?.data?.products || [];

  // Create Order Mutation
  const createMutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsCreateModalOpen(false);
      setCreateModalError('');
    },
    onError: (err) => {
      setCreateModalError(err.response?.data?.message || 'Failed to create order');
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (viewingOrder && res?.data?.order) {
        setViewingOrder(res.data.order);
      }
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update order status');
    },
  });

  const handleOpenCreateModal = () => {
    setCreateModalError('');
    setIsCreateModalOpen(true);
  };

  const handleCreateOrder = (payload) => {
    createMutation.mutate(payload);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {pagination.total} records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage transactions, server-calculated totals, and immutable line-item snapshots.
          </p>
        </div>

        {canCreate ? (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
            <ShieldAlert className="h-4 w-4" />
            <span>Viewer (Read-Only)</span>
          </div>
        )}
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'paid', 'pending', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search order # or customer..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50/50 text-xs text-slate-600">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="totalAmountPaise-desc">Highest Amount</option>
              <option value="totalAmountPaise-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-6">Order Number</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-center">Items</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Total (Rupees / Paise)</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <span className="text-xs">Loading orders...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-500">
                    <span className="text-xs">
                      {error?.response?.data?.message || 'Error loading orders'}
                    </span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingCart className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try clearing your search or status filter'
                        : 'Create your first order to begin tracking transactions'}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedRupees = (order.totalAmountPaise / 100).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setViewingOrder(order)}
                    >
                      <td className="py-4 px-6 font-mono font-medium text-slate-900 text-xs">
                        <span className="text-indigo-600 hover:underline">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 text-sm">
                          {order.customerId?.name || 'Unknown Customer'}
                        </div>
                        {order.customerId?.company && (
                          <div className="text-xs text-slate-400">{order.customerId.company}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 flex items-center gap-1.5 pt-5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formattedDate}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="font-bold text-slate-900 font-mono text-sm">
                          ₹{formattedRupees}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {order.totalAmountPaise.toLocaleString('en-IN')} paise
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Minor-Unit Security Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing order transactions for Acme Retail Corp
          </span>
          <div className="flex items-center gap-2">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage || isLoading}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        customers={activeCustomers}
        products={activeProducts}
        isSubmitting={createMutation.isPending}
        error={createModalError}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={Boolean(viewingOrder)}
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={updateStatusMutation.isPending}
        userRole={user?.role || 'Viewer'}
      />
    </div>
  );
}
