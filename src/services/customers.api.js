import api from './api';

/**
 * Fetch paginated, filtered, and searched customers
 */
export const getCustomersApi = async (params = {}) => {
  const response = await api.get('/customers', { params });
  return response.data;
};

/**
 * Get customer by ID
 */
export const getCustomerByIdApi = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

/**
 * Create a new customer
 */
export const createCustomerApi = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

/**
 * Update an existing customer
 */
export const updateCustomerApi = async ({ id, data }) => {
  const response = await api.patch(`/customers/${id}`, data);
  return response.data;
};

/**
 * Toggle customer archive status
 */
export const toggleArchiveCustomerApi = async (id) => {
  const response = await api.patch(`/customers/${id}/archive`);
  return response.data;
};
