import api from './api';

/**
 * Fetch KPI metrics and status distribution
 */
export const getDashboardStatsApi = async (params = {}) => {
  const response = await api.get('/dashboard/stats', { params });
  return response.data;
};

/**
 * Fetch chronological sales trend for chart visualization
 */
export const getSalesTrendApi = async (params = {}) => {
  const response = await api.get('/dashboard/sales-trend', { params });
  return response.data;
};

/**
 * Fetch top products ranked by revenue
 */
export const getTopProductsApi = async (params = {}) => {
  const response = await api.get('/dashboard/top-products', { params });
  return response.data;
};

/**
 * Fetch revenue & volume breakdown by product category
 */
export const getCategoryBreakdownApi = async () => {
  const response = await api.get('/dashboard/category-breakdown');
  return response.data;
};

/**
 * Fetch recent orders and customer signups
 */
export const getRecentActivityApi = async () => {
  const response = await api.get('/dashboard/recent-activity');
  return response.data;
};
