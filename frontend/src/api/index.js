import api from "./axios";

/**
 * Auth API Service
 * Handles authentication related API calls
 */
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

/**
 * Property API Service
 * Handles property related API calls
 */
export const propertyAPI = {
  getAll: (params) => api.get("/properties", { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post("/properties", data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getMyProperties: (params) => api.get("/properties/my-properties", { params }),
  approve: (id) => api.patch(`/properties/${id}/approve`),
  reject: (id) => api.patch(`/properties/${id}/reject`),
  getAllAdmin: (params) => api.get("/properties/admin/all", { params }),
};

/**
 * Booking API Service
 * Handles booking related API calls
 */
export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  getMyBookings: (params) => api.get("/bookings/my-bookings", { params }),
  getLandlordBookings: (params) =>
    api.get("/bookings/landlord-bookings", { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  reject: (id, data) => api.patch(`/bookings/${id}/reject`, data),
  cancel: (id) => api.delete(`/bookings/${id}`),
  getAllAdmin: (params) => api.get("/bookings/admin/all", { params }),
};

/**
 * Review API Service
 * Handles review related API calls
 */
export const reviewAPI = {
  create: (data) => api.post("/reviews", data),
  getPropertyReviews: (propertyId, params) =>
    api.get(`/reviews/property/${propertyId}`, { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getMyReviews: (params) => api.get("/reviews/my-reviews", { params }),
  respond: (id, data) => api.patch(`/reviews/${id}/respond`, data),
  getAllAdmin: (params) => api.get("/reviews/admin/all", { params }),
};

/**
 * Message API Service
 * Handles messaging related API calls
 */
export const messageAPI = {
  createConversation: (data) => api.post("/messages/conversations", data),
  getConversations: (params) => api.get("/messages/conversations", { params }),
  getMessages: (conversationId, params) =>
    api.get(`/messages/conversations/${conversationId}`, { params }),
  sendMessage: (data) => api.post("/messages", data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  getUnreadCount: () => api.get("/messages/unread-count"),
};

export default api;
