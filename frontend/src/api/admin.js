import api from "./axios";

/**
 * Admin API endpoints
 */
export const adminAPI = {
  // Dashboard
  getStats: () => api.get("/admin/stats"),

  // Properties
  getProperties: (page = 1, limit = 10) =>
    api.get(`/admin/properties?page=${page}&limit=${limit}`),
  deleteProperty: (id) => api.delete(`/admin/properties/${id}`),

  // Bookings
  getBookings: (page = 1, limit = 10) =>
    api.get(`/admin/bookings?page=${page}&limit=${limit}`),
  updateBookingStatus: (id, status) =>
    api.put(`/admin/bookings/${id}/status`, { status }),

  // Users
  getUsers: (page = 1, limit = 10) =>
    api.get(`/admin/users?page=${page}&limit=${limit}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Reviews
  getReviews: (page = 1, limit = 10) =>
    api.get(`/admin/reviews?page=${page}&limit=${limit}`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};

export default adminAPI;
