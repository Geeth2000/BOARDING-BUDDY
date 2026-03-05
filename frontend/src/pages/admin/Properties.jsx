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
} from "lucide-react";

/**
 * Admin Properties Page
 * Display and manage all properties
 */
const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    property: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getProperties(page);
      setProperties(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.property) return;

    setDeleting(true);
    try {
      await adminAPI.deleteProperty(deleteModal.property._id);
      setDeleteModal({ open: false, property: null });
      fetchProperties(pagination?.page || 1);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Property",
      render: (property) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
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
                {property.location || property.address?.city || "No location"}
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
          {formatLKR(property.price || 0)}
          <span className="text-xs font-normal text-gray-500">/mo</span>
        </div>
      ),
    },
    {
      header: "Landlord",
      render: (property) => (
        <div>
          <p className="text-gray-900">{property.landlord?.name || "N/A"}</p>
          <p className="text-sm text-gray-500">
            {property.landlord?.email || ""}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      render: (property) => {
        const isAvailable = property.isAvailable !== false;
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isAvailable ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {isAvailable ? "Available" : "Booked"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      cellClassName: "text-right",
      render: (property) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/properties/${property._id}`}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              /* TODO: Edit modal */
            }}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
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
            Manage all property listings on the platform
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Property
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
        loading={deleting}
      />
    </div>
  );
};

export default AdminProperties;
