import api from "./axios";

/**
 * Student API Service
 * Handles all student-related API calls
 */
const studentAPI = {
  // Dashboard stats
  getStats: () => api.get("/student/stats"),

  // Bookings
  getBookings: (params = {}) => api.get("/bookings/my-bookings", { params }),
  createBooking: (data) => api.post("/bookings", data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  getBookingById: (id) => api.get(`/bookings/${id}`),

  // Reviews
  getReviews: (params = {}) => api.get("/reviews/my-reviews", { params }),
  createReview: (data) => api.post("/reviews", data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),

  // Messages
  getConversations: (params = {}) =>
    api.get("/messages/conversations", { params }),
  getMessages: (conversationId, params = {}) =>
    api.get(`/messages/conversations/${conversationId}`, { params }),
  sendMessage: (conversationId, text) =>
    api.post("/messages", { conversationId, text }),
  createConversation: (data) => api.post("/messages/conversations", data),
  getUnreadCount: () => api.get("/messages/unread-count"),

  // Properties (approved only - from public endpoint)
  getProperties: (params = {}) => api.get("/properties", { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
};

export default studentAPI;
