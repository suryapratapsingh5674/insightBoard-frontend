import api from './api';

/**
 * Fetch paginated, filtered, and searched orders
 */
export const getOrdersApi = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

/**
 * Get single order with line items and customer snapshots
 */
export const getOrderByIdApi = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

/**
 * Create order with server-calculated price snapshots
 */
export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Update order status (pending, paid, cancelled)
 */
export const updateOrderStatusApi = async ({ id, status }) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};
