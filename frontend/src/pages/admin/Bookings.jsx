import { useState, useEffect } from "react";
import { DataTable, ConfirmModal } from "../../components";
import adminAPI from "../../api/admin";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Building2,
} from "lucide-react";

/**
 * Admin Bookings Page
 * View and manage all bookings
 */
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [statusModal, setStatusModal] = useState({
    open: false,
    booking: null,
    newStatus: null,
  });
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getBookings(page);
      setBookings(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async () => {
    if (!statusModal.booking || !statusModal.newStatus) return;

    setUpdating(true);
    try {
      await adminAPI.updateBookingStatus(
        statusModal.booking._id,
        statusModal.newStatus,
      );
      setStatusModal({ open: false, booking: null, newStatus: null });
      fetchBookings(pagination?.page || 1);
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setUpdating(false);
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
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100 text-yellow-700",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        bg: "bg-green-100 text-green-700",
        icon: CheckCircle,
        label: "Confirmed",
      },
      cancelled: {
        bg: "bg-red-100 text-red-700",
        icon: XCircle,
        label: "Cancelled",
      },
      completed: {
        bg: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      header: "Booking ID",
      render: (booking) => (
        <span className="font-mono text-sm text-gray-600">
          #{booking._id?.slice(-8).toUpperCase() || "N/A"}
        </span>
      ),
    },
    {
      header: "Property",
      render: (booking) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {booking.property?.images?.[0] ? (
              <img
                src={booking.property.images[0]}
                alt={booking.property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <span className="max-w-[150px] truncate font-medium text-gray-900">
            {booking.property?.title || "Property Deleted"}
          </span>
        </div>
      ),
    },
    {
      header: "Student",
      render: (booking) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {booking.user?.name || booking.student?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {booking.user?.email || booking.student?.email || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Dates",
      render: (booking) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(booking.checkIn || booking.startDate)}</span>
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            to {formatDate(booking.checkOut || booking.endDate)}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (booking) => getStatusBadge(booking.status),
    },
    {
      header: "Actions",
      className: "text-right",
      cellClassName: "text-right",
      render: (booking) => (
        <div className="flex items-center justify-end gap-2">
          {booking.status === "pending" && (
            <>
              <button
                onClick={() =>
                  setStatusModal({
                    open: true,
                    booking,
                    newStatus: "confirmed",
                  })
                }
                className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-100"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  setStatusModal({
                    open: true,
                    booking,
                    newStatus: "cancelled",
                  })
                }
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === "confirmed" && (
            <button
              onClick={() =>
                setStatusModal({
                  open: true,
                  booking,
                  newStatus: "cancelled",
                })
              }
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Cancel
            </button>
          )}
          <button
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const modalVariant =
    statusModal.newStatus === "confirmed" ? "success" : "danger";
  const modalTitle =
    statusModal.newStatus === "confirmed"
      ? "Approve Booking"
      : "Cancel Booking";
  const modalMessage =
    statusModal.newStatus === "confirmed"
      ? `Are you sure you want to approve this booking for "${statusModal.booking?.property?.title}"?`
      : `Are you sure you want to cancel this booking? The student will be notified.`;
  const confirmText =
    statusModal.newStatus === "confirmed" ? "Approve" : "Cancel Booking";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <p className="mt-1 text-gray-600">
          View and manage all booking requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-xl font-bold text-yellow-700">
                {bookings.filter((b) => b.status === "pending").length}
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
              <p className="text-sm text-green-600">Confirmed</p>
              <p className="text-xl font-bold text-green-700">
                {bookings.filter((b) => b.status === "confirmed").length}
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
              <p className="text-sm text-red-600">Cancelled</p>
              <p className="text-xl font-bold text-red-700">
                {bookings.filter((b) => b.status === "cancelled").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-xl font-bold text-blue-700">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchBookings}
        emptyMessage="No bookings found"
        emptyIcon={Calendar}
      />

      {/* Status Change Modal */}
      <ConfirmModal
        isOpen={statusModal.open}
        onClose={() =>
          setStatusModal({ open: false, booking: null, newStatus: null })
        }
        onConfirm={handleStatusChange}
        title={modalTitle}
        message={modalMessage}
        confirmText={confirmText}
        variant={modalVariant}
        loading={updating}
      />
    </div>
  );
};

export default AdminBookings;
