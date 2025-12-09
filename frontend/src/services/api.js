
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});


export const fetchCourts = () => api.get('/courts');
export const createCourt = (data) => api.post('/courts', data);
export const updateCourt = (id, data) => api.put(`/courts/${id}`, data);
export const deleteCourt = (id) => api.delete(`/courts/${id}`);

export const fetchCoaches = () => api.get('/coaches');
export const createCoach = (data) => api.post('/coaches', data);
export const updateCoach = (id, data) => api.put(`/coaches/${id}`, data);
export const deleteCoach = (id) => api.delete(`/coaches/${id}`);

export const fetchEquipment = () => api.get('/equipment');
export const createEquipment = (data) => api.post('/equipment', data);
export const updateEquipment = (id, data) => api.put(`/equipment/${id}`, data);
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);

export const fetchPricingRules = () => api.get('/pricing-rules');
export const createPricingRule = (data) => api.post('/pricing-rules', data);
export const updatePricingRule = (id, data) => api.put(`/pricing-rules/${id}`, data);
export const deletePricingRule = (id) => api.delete(`/pricing-rules/${id}`);

export const quotePrice = (data) => api.post('/bookings/quote', data);
export const createBooking = (data) => api.post('/bookings', data);
export const fetchBookings = (params) => api.get('/bookings', { params });
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);

export default api;
