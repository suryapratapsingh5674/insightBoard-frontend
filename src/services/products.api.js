import api from './api';

/**
 * Fetch paginated, filtered, and searched products
 */
export const getProductsApi = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

/**
 * Get product by ID
 */
export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product
 */
export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

/**
 * Update an existing product
 */
export const updateProductApi = async ({ id, data }) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

/**
 * Toggle product archive status
 */
export const toggleArchiveProductApi = async (id) => {
  const response = await api.patch(`/products/${id}/archive`);
  return response.data;
};
