import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import studentAPI from "../../api/student";
import {
  Star,
  Edit,
  Trash2,
  Building2,
  Loader2,
  AlertTriangle,
  MessageSquare,
  X,
  Plus,
  MapPin,
} from "lucide-react";

/**
 * Student My Reviews Page
 * Display and manage reviews for properties
 */
const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]); // For creating new reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, review: null });
  const [createModal, setCreateModal] = useState({
    show: false,
    booking: null,
  });
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews and bookings
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reviewsRes, bookingsRes] = await Promise.all([
        studentAPI.getReviews(),
        studentAPI.getBookings(),
      ]);

      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.data || []);
      }

      if (bookingsRes.data.success) {
        // Only show approved bookings that don't have reviews yet
        const approvedBookings = (bookingsRes.data.data || []).filter(
          (b) => b.status === "approved",
        );
        setBookings(approvedBookings);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get bookings without reviews
  const bookingsWithoutReviews = bookings.filter(
    (booking) =>
      !reviews.some(
        (r) =>
          r.bookingId === booking._id ||
          r.propertyId?._id === booking.propertyId?._id,
      ),
  );

  // Handle create review
  const handleCreateReview = async () => {
    if (!createModal.booking || !formData.comment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await studentAPI.createReview({
        propertyId: createModal.booking.propertyId?._id,
        bookingId: createModal.booking._id,
        rating: formData.rating,
        comment: formData.comment,
      });

      if (data.success) {
        await fetchData(); // Refresh data
        setCreateModal({ show: false, booking: null });
        setFormData({ rating: 5, comment: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create review");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update review
  const handleUpdateReview = async () => {
    if (!editingReview || !formData.comment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await studentAPI.updateReview(editingReview._id, {
        rating: formData.rating,
        comment: formData.comment,
      });

      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === editingReview._id
              ? { ...r, rating: formData.rating, comment: formData.comment }
              : r,
          ),
        );
        setEditingReview(null);
        setFormData({ rating: 5, comment: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!deleteModal.review) return;

    setSubmitting(true);
    try {
      const { data } = await studentAPI.deleteReview(deleteModal.review._id);
      if (data.success) {
        setReviews((prev) =>
          prev.filter((r) => r._id !== deleteModal.review._id),
        );
        setDeleteModal({ show: false, review: null });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (review) => {
    setEditingReview(review);
    setFormData({ rating: review.rating, comment: review.comment });
  };

  // Open create modal
  const openCreateModal = (booking) => {
    setCreateModal({ show: true, booking });
    setFormData({ rating: 5, comment: "" });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-red-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Failed to load reviews
        </h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Reviews</h1>
        <p className="mt-1 text-gray-600">
          Share your experience with other students
        </p>
      </div>

      {/* Bookings eligible for review */}
      {bookingsWithoutReviews.length > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-900">Write a Review</h3>
          <p className="mt-1 text-sm text-blue-700">
            You have {bookingsWithoutReviews.length} property(s) awaiting your
            review
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {bookingsWithoutReviews.map((booking) => (
              <button
                key={booking._id}
                onClick={() => openCreateModal(booking)}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-700 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                {booking.propertyId?.title || "Property"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <MessageSquare className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No reviews yet
          </h3>
          <p className="mt-1 text-center text-gray-600">
            {bookingsWithoutReviews.length > 0
              ? "Share your experience by leaving a review above"
              : "Book a property to leave a review"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={openEditModal}
              onDelete={(review) => setDeleteModal({ show: true, review })}
            />
          ))}
        </div>
      )}

      {/* Create Review Modal */}
      {createModal.show && createModal.booking && (
        <ReviewFormModal
          title="Write a Review"
          property={createModal.booking.propertyId}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setCreateModal({ show: false, booking: null })}
          onSubmit={handleCreateReview}
          submitting={submitting}
          submitLabel="Submit Review"
        />
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewFormModal
          title="Edit Review"
          property={editingReview.propertyId}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setEditingReview(null)}
          onSubmit={handleUpdateReview}
          submitting={submitting}
          submitLabel="Update Review"
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Review
              </h3>
              <button
                onClick={() => setDeleteModal({ show: false, review: null })}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600">
              Are you sure you want to delete your review for{" "}
              <span className="font-medium">
                {deleteModal.review.propertyId?.title || "this property"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, review: null })}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={submitting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Review Card Component
 */
const ReviewCard = ({ review, onEdit, onDelete }) => {
  const property = review.propertyId;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLocationString = () => {
    if (!property?.location) return "";
    if (typeof property.location === "string") return property.location;
    return property.location.city || property.location.address || "";
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* Property Info */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          <Building2 className="h-6 w-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <Link
            to={`/properties/${property?._id}`}
            className="font-semibold text-gray-900 hover:text-blue-600"
          >
            {property?.title || "Property"}
          </Link>
          {getLocationString() && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {getLocationString()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(review)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
            title="Edit review"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(review)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            title="Delete review"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rating and Review */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </span>
        </div>
        <p className="mt-3 text-gray-700">{review.comment}</p>
      </div>

      {/* Landlord Response */}
      {review.landlordResponse && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Landlord Response</p>
          <p className="mt-1 text-sm text-gray-700">
            {review.landlordResponse}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Review Form Modal Component
 */
const ReviewFormModal = ({
  title,
  property,
  formData,
  setFormData,
  onClose,
  onSubmit,
  submitting,
  submitLabel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Property */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Building2 className="h-8 w-8 text-gray-400" />
          <span className="font-medium text-gray-900">
            {property?.title || "Property"}
          </span>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= formData.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder="Share your experience with this property..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || !formData.comment.trim()}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentReviews;
