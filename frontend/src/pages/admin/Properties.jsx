import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable, ConfirmModal } from "../../components";
import adminAPI from "../../api/admin";
import { formatLKR } from "../../utils/currency";
import {
  Building2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  X,
  Filter,
} from "lucide-react";

/**
 * Admin Properties Page
 * Display and manage all properties with approval system
 */
const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    property: null,
  });
  const [approvalModal, setApprovalModal] = useState({
    open: false,
    property: null,
    action: null, // 'approve' or 'reject'
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getProperties(page, 10, statusFilter);
      setProperties(data.data);
      setPagination(data.pagination);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleDelete = async () => {
    if (!deleteModal.property) return;

    setActionLoading(true);
    try {
      await adminAPI.deleteProperty(deleteModal.property._id);
      setDeleteModal({ open: false, property: null });
      fetchProperties(pagination?.page || 1);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovalAction = async () => {
    if (!approvalModal.property) return;

    setActionLoading(true);
    try {
      const status =
        approvalModal.action === "approve" ? "Approved" : "Rejected";
      await adminAPI.updatePropertyStatus(
        approvalModal.property._id,
        status,
        approvalModal.action === "reject" ? rejectionReason : "",
      );
      setApprovalModal({ open: false, property: null, action: null });
      setRejectionReason("");
      fetchProperties(pagination?.page || 1);
    } catch (error) {
      console.error("Error updating property status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Pending: {
        bg: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      },
      Approved: {
        bg: "bg-green-100 text-green-700",
        icon: CheckCircle,
      },
      Rejected: {
        bg: "bg-red-100 text-red-700",
        icon: XCircle,
      },
    };

    const statusConfig = config[status] || config.Pending;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.bg}`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const columns = [
    {
      header: "Property",
      render: (property) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]?.url || property.images[0]}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{property.title}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span className="max-w-[200px] truncate">
                {property.location?.city ||
                  property.location?.address ||
                  "No location"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      render: (property) => (
        <div className="font-semibold text-blue-600">
          {formatLKR(property.rent || 0)}
          <span className="text-xs font-normal text-gray-500">/mo</span>
        </div>
      ),
    },
    {
      header: "Landlord",
      render: (property) => (
        <div>
          <p className="text-gray-900">{property.landlordId?.name || "N/A"}</p>
          <p className="text-sm text-gray-500">
            {property.landlordId?.email || ""}
          </p>
          {property.landlordId?.isVerified && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
              <CheckCircle className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      render: (property) => getStatusBadge(property.status),
    },
    {
      header: "Actions",
      className: "text-right",
      cellClassName: "text-right",
      render: (property) => (
        <div className="flex items-center justify-end gap-1">
          {/* Approve Button */}
          {property.status !== "Approved" && (
            <button
              onClick={() =>
                setApprovalModal({ open: true, property, action: "approve" })
              }
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
              title="Approve"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {/* Reject Button */}
          {property.status !== "Rejected" && (
            <button
              onClick={() =>
                setApprovalModal({ open: true, property, action: "reject" })
              }
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Reject"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Link
            to={`/properties/${property._id}`}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, property })}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <p className="mt-1 text-gray-600">
            Manage all property listings and approvals
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => setStatusFilter("")}
          className={`rounded-xl p-4 text-left transition-all ${
            statusFilter === ""
              ? "bg-blue-100 ring-2 ring-blue-500"
              : "bg-blue-50 hover:bg-blue-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">All Properties</p>
              <p className="text-xl font-bold text-blue-700">
                {stats.pending + stats.approved + stats.rejected}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter("Pending")}
          className={`rounded-xl p-4 text-left transition-all ${
            statusFilter === "Pending"
              ? "bg-yellow-100 ring-2 ring-yellow-500"
              : "bg-yellow-50 hover:bg-yellow-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Pending Approval</p>
              <p className="text-xl font-bold text-yellow-700">
                {stats.pending}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter("Approved")}
          className={`rounded-xl p-4 text-left transition-all ${
            statusFilter === "Approved"
              ? "bg-green-100 ring-2 ring-green-500"
              : "bg-green-50 hover:bg-green-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-xl font-bold text-green-700">
                {stats.approved}
              </p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter("Rejected")}
          className={`rounded-xl p-4 text-left transition-all ${
            statusFilter === "Rejected"
              ? "bg-red-100 ring-2 ring-red-500"
              : "bg-red-50 hover:bg-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-xl font-bold text-red-700">{stats.rejected}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={properties}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchProperties}
        emptyMessage="No properties found"
        emptyIcon={Building2}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, property: null })}
        onConfirm={handleDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteModal.property?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />

      {/* Approval/Rejection Modal */}
      <ConfirmModal
        isOpen={approvalModal.open}
        onClose={() => {
          setApprovalModal({ open: false, property: null, action: null });
          setRejectionReason("");
        }}
        onConfirm={handleApprovalAction}
        title={
          approvalModal.action === "approve"
            ? "Approve Property"
            : "Reject Property"
        }
        message={
          approvalModal.action === "approve"
            ? `Are you sure you want to approve "${approvalModal.property?.title}"? It will be visible to all users.`
            : `Are you sure you want to reject "${approvalModal.property?.title}"?`
        }
        confirmText={approvalModal.action === "approve" ? "Approve" : "Reject"}
        variant={approvalModal.action === "approve" ? "success" : "danger"}
        loading={actionLoading}
      >
        {approvalModal.action === "reject" && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rejection Reason (Optional)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>
        )}
      </ConfirmModal>
    </div>
  );
};

export default AdminProperties;
