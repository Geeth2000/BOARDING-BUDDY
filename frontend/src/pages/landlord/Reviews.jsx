import { useState, useEffect } from "react";
import landlordAPI from "../../api/landlord";
import {
  Star,
  MessageSquare,
  Building2,
  User,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  Send,
  Reply,
} from "lucide-react";

/**
 * Reviews Page
 * View and respond to reviews for landlord's properties
 */
const LandlordReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await landlordAPI.getReviews(page);
      setReviews(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;

    setResponding(true);
    try {
      await landlordAPI.respondToReview(reviewId, responseText);
      setSuccess("Response added successfully");
      setRespondingTo(null);
      setResponseText("");
      fetchReviews(pagination?.page || 1);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add response");
    } finally {
      setResponding(false);
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

  // Calculate stats
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const respondedCount = reviews.filter((r) => r.landlordResponse).length;

  if (loading && reviews.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <p className="mt-1 text-gray-600">
          View and respond to reviews from tenants
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

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
                {fiveStarCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-purple-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Reply className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Responded</p>
              <p className="text-xl font-bold text-purple-700">
                {respondedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Star className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-800">No reviews yet</h3>
          <p className="mt-1 text-gray-500">
            Reviews will appear here once tenants leave feedback
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="p-4 lg:p-6">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Property Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {review.propertyId?.images?.[0] ? (
                        <img
                          src={
                            review.propertyId.images[0].url ||
                            review.propertyId.images[0]
                          }
                          alt={review.propertyId.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {review.propertyId?.title || "Property Deleted"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{review.studentId?.name || "Anonymous"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Date */}
                  <div className="flex items-center gap-4">
                    {renderStars(review.rating)}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700">
                  {review.comment || "No comment provided"}
                </p>

                {/* Landlord Response */}
                {review.landlordResponse && (
                  <div className="mt-4 rounded-xl bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
                      <Reply className="h-4 w-4" />
                      Your Response
                      <span className="text-xs font-normal text-blue-500">
                        ({formatDate(review.respondedAt)})
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {review.landlordResponse}
                    </p>
                  </div>
                )}

                {/* Response Form */}
                {!review.landlordResponse && (
                  <div className="mt-4">
                    {respondingTo === review._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write your response to this review..."
                          rows={3}
                          maxLength={500}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {responseText.length}/500 characters
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText("");
                              }}
                              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleRespond(review._id)}
                              disabled={responding || !responseText.trim()}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {responding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRespondingTo(review._id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <Reply className="h-4 w-4" />
                        Respond to Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchReviews(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchReviews(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LandlordReviews;
