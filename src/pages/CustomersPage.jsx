import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Building2,
  Mail,
  Archive,
  RotateCcw,
  Edit2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import {
  getCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  toggleArchiveCustomerApi,
} from '../services/customers.api';
import CustomerModal from '../components/customers/CustomerModal';
import ArchiveConfirmModal from '../components/common/ArchiveConfirmModal';

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const canEdit = user?.role === 'Admin' || user?.role === 'Analyst';
  const canArchive = user?.role === 'Admin';

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'archived' | 'all'
  const [page, setPage] = useState(1);

  // Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalError, setModalError] = useState('');

  // Archive Confirm Modal State
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [customerToArchive, setCustomerToArchive] = useState(null);

  // Fetch Customers with TanStack Query
  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['customers', { page, search: debouncedSearch, status: statusFilter }],
    queryFn: () =>
      getCustomersApi({
        page,
        limit: 8,
        search: debouncedSearch,
        status: statusFilter,
      }),
    keepPreviousData: true,
  });

  const customers = data?.data?.customers || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsCustomerModalOpen(false);
    },
    onError: (err) => {
      setModalError(err.friendlyMessage || 'Failed to create customer');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: updateCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsCustomerModalOpen(false);
    },
    onError: (err) => {
      setModalError(err.friendlyMessage || 'Failed to update customer');
    },
  });

  // Archive Mutation
  const archiveMutation = useMutation({
    mutationFn: toggleArchiveCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setArchiveModalOpen(false);
    },
    onError: (err) => {
      alert(err.friendlyMessage || 'Failed to archive customer');
    },
  });

  const handleOpenCreate = () => {
    setSelectedCustomer(null);
    setModalError('');
    setIsCustomerModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setSelectedCustomer(cust);
    setModalError('');
    setIsCustomerModalOpen(true);
  };

  const handleCustomerSubmit = (formData) => {
    setModalError('');
    if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenArchive = (cust) => {
    setCustomerToArchive(cust);
    setArchiveModalOpen(true);
  };

  const handleConfirmArchive = () => {
    if (customerToArchive) {
      archiveMutation.mutate(customerToArchive._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage workspace customer directories, contact profiles, and purchase accounts.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
            { label: 'All', value: 'all' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => {
                setStatusFilter(pill.value);
                setPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === pill.value
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Debounced Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, company, or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading workspace customers...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-sm">
            Error loading customers: {error?.friendlyMessage || 'Network error'}
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No customers found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              {debouncedSearch
                ? `No active customers matching "${debouncedSearch}". Try clearing your search filter.`
                : 'Your workspace has no customers matching the selected status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Phone</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{cust.name}</div>
                      <div className="text-xs text-slate-400">{cust.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      {cust.company ? (
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{cust.company}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {cust.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{cust.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {cust.isArchived ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Archived
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(cust)}
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Edit Customer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canArchive && (
                          <button
                            onClick={() => handleOpenArchive(cust)}
                            className={`p-1 rounded-lg transition-colors ${
                              cust.isArchived
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                            title={cust.isArchived ? 'Restore Customer' : 'Archive Customer'}
                          >
                            {cust.isArchived ? (
                              <RotateCcw className="h-3.5 w-3.5" />
                            ) : (
                              <Archive className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {customers.length} of {pagination.total} customer records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Customer Modal (Create & Edit) */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        customer={selectedCustomer}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={modalError}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleCustomerSubmit}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmModal
        isOpen={archiveModalOpen}
        title={customerToArchive?.isArchived ? 'Restore Customer' : 'Archive Customer'}
        message={
          customerToArchive?.isArchived
            ? `Are you sure you want to restore "${customerToArchive?.name}"? They will reappear in active customer listings.`
            : `Are you sure you want to archive "${customerToArchive?.name}"? Historical orders will be preserved, but they will be hidden from active lists.`
        }
        confirmText={customerToArchive?.isArchived ? 'Restore' : 'Archive'}
        isArchiving={archiveMutation.isPending}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
}
