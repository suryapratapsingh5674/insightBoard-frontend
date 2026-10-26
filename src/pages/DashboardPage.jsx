import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  getDashboardStatsApi,
  getSalesTrendApi,
  getTopProductsApi,
  getRecentActivityApi,
} from '../services/dashboard.api';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // 'all' | '90d' | '30d'

  // 1. Fetch KPI metrics and order status distribution
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery({
    queryKey: ['dashboard', 'stats', selectedPeriod],
    queryFn: () => getDashboardStatsApi({ period: selectedPeriod }),
  });

  // 2. Fetch Sales Trend for Recharts
  const {
    data: trendData,
    isLoading: isTrendLoading,
  } = useQuery({
    queryKey: ['dashboard', 'sales-trend', selectedPeriod],
    queryFn: () => getSalesTrendApi({ range: selectedPeriod }),
  });

  // 3. Fetch Top Selling Products
  const {
    data: topProductsData,
    isLoading: isTopProductsLoading,
  } = useQuery({
    queryKey: ['dashboard', 'top-products'],
    queryFn: () => getTopProductsApi({ limit: 5 }),
  });

  // 4. Fetch Recent Activity
  const {
    data: activityData,
    isLoading: isActivityLoading,
  } = useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => getRecentActivityApi(),
  });

  const stats = statsData?.data;
  const trend = trendData?.data?.trend || [];
  const topProducts = topProductsData?.data?.topProducts || [];
  const recentOrders = activityData?.data?.recentOrders || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 capitalize">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor sales velocity, recurring order fulfillment, and customer metrics.
          </p>
        </div>

        {/* Period Filter Pill Controls */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-2xs">
          {[
            { id: 'all', label: 'All Time' },
            { id: '90d', label: 'Past 90 Days' },
            { id: '30d', label: 'Past 30 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPeriod(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedPeriod === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Paid Revenue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Paid Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {isStatsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 my-1" />
            ) : (
              <span className="text-2xl font-bold font-mono text-slate-900">
                {stats?.revenue?.formatted || '₹0.00'}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Sum of settled orders in integer paise
          </p>
        </div>

        {/* Card 2: Paid Orders */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Paid Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {isStatsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 my-1" />
            ) : (
              <>
                <span className="text-2xl font-bold text-slate-900">
                  {stats?.orders?.paidOrders || 0}
                </span>
                <span className="text-xs text-slate-400">
                  of {stats?.orders?.totalOrders || 0} total
                </span>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Excludes pending & cancelled transactions
          </p>
        </div>

        {/* Card 3: Active Customers */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Customers
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {isStatsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 my-1" />
            ) : (
              <span className="text-2xl font-bold text-slate-900">
                {stats?.customers?.activeCustomersCount || 0}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Active workspace client accounts
          </p>
        </div>

        {/* Card 4: Average Order Value (AOV) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg. Order Value (AOV)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {isStatsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 my-1" />
            ) : (
              <span className="text-2xl font-bold font-mono text-slate-900">
                {stats?.aov?.formatted || '₹0.00'}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Formula: Total Paid Revenue ÷ Paid Orders
          </p>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prominent Revenue Over Time Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Revenue Analytics</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological daily gross receipts from settled orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {selectedPeriod === 'all' ? 'All historical data' : selectedPeriod === '90d' ? 'Past 90 days' : 'Past 30 days'}
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            {isTrendLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
                <span className="text-xs">Aggregating sales trend...</span>
              </div>
            ) : trend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No revenue records found for this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      'Revenue',
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#E2E8F0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Breakdown Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Order Health</h2>
              <span className="text-xs text-slate-400">Status Distribution</span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Paid */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Paid & Settled
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stats?.statusDistribution?.paid?.percentage || 0}% ({stats?.statusDistribution?.paid?.count || 0})
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.statusDistribution?.paid?.percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Pending */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending Payment
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stats?.statusDistribution?.pending?.percentage || 0}% ({stats?.statusDistribution?.pending?.count || 0})
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.statusDistribution?.pending?.percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Cancelled */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Cancelled
                  </span>
                  <span className="font-semibold text-slate-900">
                    {stats?.statusDistribution?.cancelled?.percentage || 0}% ({stats?.statusDistribution?.cancelled?.count || 0})
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.statusDistribution?.cancelled?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Top Selling Products & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products Leaderboard */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Top Selling Products</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by total revenue from paid receipts</p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Catalog <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {isTopProductsLoading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                <span className="text-xs">Computing product rankings...</span>
              </div>
            ) : topProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No product sales recorded yet
              </div>
            ) : (
              topProducts.map((prod, index) => (
                <div key={prod.productId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{prod.name}</div>
                      <div className="font-mono text-xs text-slate-400">
                        {prod.sku} • {prod.unitsSold} units sold
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-900 text-sm">
                    {prod.formattedRevenue}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Feed */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest orders created across workspace</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              All Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {isActivityLoading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                <span className="text-xs">Loading transaction feed...</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No transactions found
              </div>
            ) : (
              recentOrders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const formattedAmount = (order.totalAmountPaise / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

                return (
                  <div key={order._id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {order.customerId?.name || 'Customer'} • {formattedDate}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{formattedAmount}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
