import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  Package,
  Plus,
  Search,
  Filter,
  Tag,
  Hash,
  Archive,
  RotateCcw,
  Edit2,
  Loader2,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  toggleArchiveProductApi,
} from '../services/products.api';
import ProductModal from '../components/products/ProductModal';
import ArchiveConfirmModal from '../components/common/ArchiveConfirmModal';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const canEdit = user?.role === 'Admin' || user?.role === 'Analyst';
  const canArchive = user?.role === 'Admin';

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'archived' | 'all'
  const [page, setPage] = useState(1);

  // Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalError, setModalError] = useState('');

  // Archive Modal State
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);

  // Fetch Products with TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'products',
      { page, search: debouncedSearch, category: selectedCategory, status: statusFilter },
    ],
    queryFn: () =>
      getProductsApi({
        page,
        limit: 8,
        search: debouncedSearch,
        category: selectedCategory,
        status: statusFilter,
      }),
    keepPreviousData: true,
  });

  const products = data?.data?.products || [];
  const categories = data?.data?.categories || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsProductModalOpen(false);
    },
    onError: (err) => {
      setModalError(err.friendlyMessage || 'Failed to create product');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsProductModalOpen(false);
    },
    onError: (err) => {
      setModalError(err.friendlyMessage || 'Failed to update product');
    },
  });

  // Archive Mutation
  const archiveMutation = useMutation({
    mutationFn: toggleArchiveProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setArchiveModalOpen(false);
    },
    onError: (err) => {
      alert(err.friendlyMessage || 'Failed to archive product');
    },
  });

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setModalError('');
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setModalError('');
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (formData) => {
    setModalError('');
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenArchive = (prod) => {
    setProductToArchive(prod);
    setArchiveModalOpen(true);
  };

  const handleConfirmArchive = () => {
    if (productToArchive) {
      archiveMutation.mutate(productToArchive._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage SKU listings, categories, and unit pricing in minor currency units (paise).
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
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

        {/* Right side: Category Dropdown & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Debounced Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search product or SKU..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading product catalog...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-sm">
            Error loading products: {error?.friendlyMessage || 'Network error'}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No products found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              {debouncedSearch
                ? `No products matching "${debouncedSearch}". Try clearing your search filter.`
                : 'Your catalog has no products matching the current category or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">SKU</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Unit Price</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{prod.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500 font-medium">
                      {prod.sku}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
                        <Tag className="h-3 w-3 text-slate-400" />
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      ₹{(prod.unitPricePaise / 100).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-6">
                      {prod.isArchived ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Archived
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canArchive && (
                          <button
                            onClick={() => handleOpenArchive(prod)}
                            className={`p-1 rounded-lg transition-colors ${
                              prod.isArchived
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                            title={prod.isArchived ? 'Restore Product' : 'Archive Product'}
                          >
                            {prod.isArchived ? (
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
            Showing {products.length} of {pagination.total} catalog items (Calculated in minor paise units)
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

      {/* Product Modal (Create & Edit) */}
      <ProductModal
        isOpen={isProductModalOpen}
        product={selectedProduct}
        categories={categories}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={modalError}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmModal
        isOpen={archiveModalOpen}
        title={productToArchive?.isArchived ? 'Restore Product' : 'Archive Product'}
        message={
          productToArchive?.isArchived
            ? `Are you sure you want to restore "${productToArchive?.name}"? It will reappear in active product listings.`
            : `Are you sure you want to archive "${productToArchive?.name}"? Historical orders referencing this SKU will preserve their snapshots, but the product will be hidden from new orders.`
        }
        confirmText={productToArchive?.isArchived ? 'Restore' : 'Archive'}
        isArchiving={archiveMutation.isPending}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
}
