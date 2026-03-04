import { useState, useEffect } from "react";
import { DataTable, ConfirmModal } from "../../components";
import adminAPI from "../../api/admin";
import {
  Star,
  Trash2,
  Eye,
  Building2,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

/**
 * Admin Reviews Page
 * Moderate and manage all reviews
 */
const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, review: null });
  const [viewModal, setViewModal] = useState({ open: false, review: null });
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getReviews(page);
      setReviews(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.review) return;

    setDeleting(true);
    try {
      await adminAPI.deleteReview(deleteModal.review._id);
      setDeleteModal({ open: false, review: null });
      fetchReviews(pagination?.page || 1);
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating?.toFixed(1) || "0.0"}
        </span>
      </div>
    );
  };

  const columns = [
    {
      header: "Property",
      render: (review) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {review.property?.images?.[0] ? (
              <img
                src={review.property.images[0]}
                alt={review.property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <span className="max-w-[150px] truncate font-medium text-gray-900">
            {review.property?.title || "Property Deleted"}
          </span>
        </div>
      ),
    },
    {
      header: "Reviewer",
      render: (review) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {review.user?.name || review.reviewer?.name || "Anonymous"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      render: (review) => renderStars(review.rating),
    },
    {
      header: "Comment",
      render: (review) => (
        <p className="max-w-[200px] truncate text-sm text-gray-600">
          {review.comment || review.text || "No comment"}
        </p>
      ),
    },
    {
      header: "Date",
      render: (review) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="h-3 w-3" />
          {formatDate(review.createdAt)}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cellClassName: "text-right",
      render: (review) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setViewModal({ open: true, review })}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="View Review"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, review })}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete Review"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Calculate stats
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <p className="mt-1 text-gray-600">
          Moderate and manage all property reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Reviews</p>
              <p className="text-xl font-bold text-blue-700">
                {reviews.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Average Rating</p>
              <p className="text-xl font-bold text-yellow-700">
                {avgRating.toFixed(1)} / 5.0
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">5-Star Reviews</p>
              <p className="text-xl font-bold text-green-700">
                {reviews.filter((r) => r.rating === 5).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Star className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Low Reviews (1-2)</p>
              <p className="text-xl font-bold text-red-700">
                {reviews.filter((r) => r.rating <= 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchReviews}
        emptyMessage="No reviews found"
        emptyIcon={MessageSquare}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, review: null })}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />

      {/* View Review Modal */}
      {viewModal.open && viewModal.review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewModal({ open: false, review: null })}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Details
            </h3>
            <div className="mt-4 space-y-4">
              {/* Property */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Property
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {viewModal.review.property?.title || "Property Deleted"}
                </p>
              </div>
              {/* Reviewer */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Reviewer
                </p>
                <p className="mt-1 text-gray-900">
                  {viewModal.review.user?.name ||
                    viewModal.review.reviewer?.name ||
                    "Anonymous"}
                </p>
              </div>
              {/* Rating */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Rating
                </p>
                <div className="mt-1">
                  {renderStars(viewModal.review.rating)}
                </div>
              </div>
              {/* Comment */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Comment
                </p>
                <p className="mt-1 text-gray-700">
                  {viewModal.review.comment ||
                    viewModal.review.text ||
                    "No comment provided"}
                </p>
              </div>
              {/* Date */}
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Date
                </p>
                <p className="mt-1 text-gray-600">
                  {formatDate(viewModal.review.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewModal({ open: false, review: null })}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewModal({ open: false, review: null });
                  setDeleteModal({ open: true, review: viewModal.review });
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
