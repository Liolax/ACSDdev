export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/api/products',
  GET_ONE: (id) => `/api/products/${id}`,
  GET_MY: '/api/products/my',
  CREATE: '/api/products',
  UPDATE: (id) => `/api/products/${id}`,
  DELETE: (id) => `/api/products/${id}`
};

export default PRODUCT_ENDPOINTS;