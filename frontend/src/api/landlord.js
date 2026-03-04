import api from "./axios";

/**
 * Landlord API Service
 * Handles all landlord-related API calls
 */
const landlordAPI = {
  // Dashboard stats
  getStats: () => api.get("/landlord/stats"),

  // Properties
  getProperties: (page = 1, params = {}) =>
    api.get("/landlord/properties", { params: { page, ...params } }),
  getProperty: (id) => api.get(`/landlord/properties/${id}`),
  createProperty: (data) => api.post("/landlord/properties", data),
  updateProperty: (id, data) => api.put(`/landlord/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/landlord/properties/${id}`),

  // Bookings
  getBookings: (page = 1, params = {}) =>
    api.get("/landlord/bookings", { params: { page, ...params } }),
  updateBookingStatus: (id, status, rejectionReason = "") =>
    api.put(`/landlord/bookings/${id}`, { status, rejectionReason }),

  // Reviews
  getReviews: (page = 1) => api.get("/landlord/reviews", { params: { page } }),
  respondToReview: (id, response) =>
    api.put(`/landlord/reviews/${id}`, { response }),

  // Messages
  getConversations: () => api.get("/landlord/messages"),
  getMessages: (conversationId, page = 1) =>
    api.get(`/landlord/messages/${conversationId}`, { params: { page } }),
  sendMessage: (data) => api.post("/landlord/messages", data),
};

export default landlordAPI;
