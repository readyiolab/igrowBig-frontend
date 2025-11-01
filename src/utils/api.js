// src/utils/api.js
const API_BASE = 'http://localhost:3001/api';

export const api = {
  async get(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}${url}${query ? `?${query}` : ''}`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.status) throw new Error(json.message || 'API error');
    return json.data;
  },

  getCategories: () => api.get('/categories'),
  getCountries: () => api.get('/countries'),
  getProducts: (country, categoryName) =>
    api.get('/products', { country, categoryName }),
  getProduct: (id, country) => api.get(`/product/${id}`, { country }),
};