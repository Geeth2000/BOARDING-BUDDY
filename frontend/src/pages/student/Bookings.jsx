import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import studentAPI from "../../api/student";
import { formatLKR } from "../../utils/currency";
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";

/**
 * Student My Bookings Page
 * Display all bookings with status and actions
 */
const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await studentAPI.getBookings();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCancellingId(selectedBooking._id);
    try {
      const { data } = await studentAPI.cancelBooking(selectedBooking._id);
      if (data.success) {
        // Update the booking status locally
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBooking._id ? { ...b, status: "cancelled" } : b,
          ),
        );
        setShowCancelModal(false);
        setSelectedBooking(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  // Filter bookings
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
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
          Failed to load bookings
        </h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={fetchBookings}
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
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="mt-1 text-gray-600">
          Track and manage your accommodation booking requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
          { key: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label} ({statusCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Calendar className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No bookings found
          </h3>
          <p className="mt-1 text-gray-600">
            {filter === "all"
              ? "You haven't made any booking requests yet"
              : `No ${filter} bookings`}
          </p>
          <Link
            to="/student/properties"
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={openCancelModal}
              cancelling={cancellingId === booking._id}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600">
              Are you sure you want to cancel your booking request for{" "}
              <span className="font-medium">
                {selectedBooking.propertyId?.title || "this property"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancellingId}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancellingId ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                  "Cancel Booking"
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
 * Booking Card Component
 */
const BookingCard = ({ booking, onCancel, cancelling }) => {
  const property = booking.propertyId;

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "Rejected",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          label: "Cancelled",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const getImageUrl = () => {
    if (!property?.images || property.images.length === 0) return null;
    const firstImage = property.images[0];
    return typeof firstImage === "string" ? firstImage : firstImage?.url;
  };

  const getLocationString = () => {
    if (!property?.location) return "Location not specified";
    if (typeof property.location === "string") return property.location;
    return (
      property.location.city ||
      property.location.address ||
      "Location not specified"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full md:h-auto md:w-48 lg:w-56">
          {getImageUrl() ? (
            <img
              src={getImageUrl()}
              alt={property?.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <Building2 className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {property?.title || "Property"}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{getLocationString()}</span>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${statusConfig.bg} ${statusConfig.border} border`}
            >
              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Monthly Rent</p>
              <p className="mt-0.5 font-semibold text-gray-900">
                {formatLKR(booking.rent || property?.rent || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Move-in Date</p>
              <p className="mt-0.5 font-medium text-gray-900">
                {formatDate(booking.moveInDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Requested On</p>
              <p className="mt-0.5 font-medium text-gray-900">
                {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>

          {/* Message if any */}
          {booking.message && (
            <div className="mt-4 flex gap-2 rounded-lg bg-gray-50 p-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-gray-400" />
              <p className="text-sm text-gray-600">{booking.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
            <Link
              to={`/properties/${property?._id}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Property
            </Link>
            {booking.status === "pending" && (
              <button
                onClick={() => onCancel(booking)}
                disabled={cancelling}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === "approved" && (
              <Link
                to="/student/messages"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Message Landlord
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBookings;
