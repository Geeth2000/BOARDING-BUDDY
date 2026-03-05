import { useState, useEffect } from "react";
import landlordAPI from "../../api/landlord";
import { ConfirmModal } from "../../components";
import { formatLKR } from "../../utils/currency";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

/**
 * Booking Requests Page
 * View and manage booking requests for landlord's properties
 */
const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filter, setFilter] = useState("all");
  const [actionModal, setActionModal] = useState({
    open: false,
    booking: null,
    action: null,
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await landlordAPI.getBookings(page, params);
      setBookings(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const handleAction = async () => {
    if (!actionModal.booking || !actionModal.action) return;

    setActionLoading(true);
    try {
      await landlordAPI.updateBookingStatus(
        actionModal.booking._id,
        actionModal.action,
        actionModal.action === "rejected" ? rejectionReason : "",
      );
      setSuccess(
        `Booking ${actionModal.action === "approved" ? "approved" : "rejected"} successfully`,
      );
      setActionModal({ open: false, booking: null, action: null });
      setRejectionReason("");
      fetchBookings(pagination?.page || 1);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking");
    } finally {
      setActionLoading(false);
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

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        bg: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending",
      },
      approved: {
        bg: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const statusConfig = config[status] || config.pending;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.bg}`}
      >
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </span>
    );
  };

  // Stats counts
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const approvedCount = bookings.filter((b) => b.status === "approved").length;
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length;

  if (loading && bookings.length === 0) {
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
        <h1 className="text-2xl font-bold text-gray-800">Booking Requests</h1>
        <p className="mt-1 text-gray-600">
          Manage booking requests for your properties
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
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-xl font-bold text-yellow-700">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-xl font-bold text-green-700">
                {approvedCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-xl font-bold text-red-700">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Calendar className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-800">
            No booking requests
          </h3>
          <p className="mt-1 text-gray-500">
            Booking requests will appear here when students apply
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Property Info */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {booking.propertyId?.images?.[0] ? (
                      <img
                        src={
                          booking.propertyId.images[0].url ||
                          booking.propertyId.images[0]
                        }
                        alt={booking.propertyId.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {booking.propertyId?.title || "Property Deleted"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatLKR(booking.rent || 0)}/month
                    </p>
                  </div>
                </div>

                {/* Tenant Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {booking.studentId?.name || "Unknown"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      {booking.studentId?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {booking.studentId.email}
                        </span>
                      )}
                      {booking.studentId?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {booking.studentId.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Move-in: {formatDate(booking.moveInDate)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Requested: {formatDate(booking.createdAt)}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(booking.status)}
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setActionModal({
                            open: true,
                            booking,
                            action: "approved",
                          })
                        }
                        className="rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setActionModal({
                            open: true,
                            booking,
                            action: "rejected",
                          })
                        }
                        className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              {booking.message && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Message:</span>{" "}
                    {booking.message}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              {booking.status === "rejected" && booking.rejectionReason && (
                <div className="border-t border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    <span className="font-medium">Rejection reason:</span>{" "}
                    {booking.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchBookings(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchBookings(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setActionModal({ open: false, booking: null, action: null });
              setRejectionReason("");
            }}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                actionModal.action === "approved"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {actionModal.action === "approved" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {actionModal.action === "approved"
                ? "Approve Booking"
                : "Reject Booking"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {actionModal.action === "approved"
                ? "Are you sure you want to approve this booking request? The tenant will be notified."
                : "Please provide a reason for rejection (optional)."}
            </p>

            {actionModal.action === "rejected" && (
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
                className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActionModal({ open: false, booking: null, action: null });
                  setRejectionReason("");
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  actionModal.action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : actionModal.action === "approved" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {actionModal.action === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
