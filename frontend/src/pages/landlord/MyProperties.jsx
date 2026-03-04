import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import landlordAPI from "../../api/landlord";
import { ConfirmModal } from "../../components";
import {
  Building2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  Bed,
  Bath,
} from "lucide-react";

/**
 * My Properties Page
 * Display and manage landlord's properties
 */
const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    property: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await landlordAPI.getProperties(page);
      setProperties(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load properties");
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
      await landlordAPI.deleteProperty(deleteModal.property._id);
      setSuccess("Property deleted successfully");
      setDeleteModal({ open: false, property: null });
      fetchProperties(pagination?.page || 1);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (property) => {
    if (!property.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          <Clock className="h-3 w-3" />
          Pending Approval
        </span>
      );
    }
    if (!property.isActive) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          <XCircle className="h-3 w-3" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" />
        Active
      </span>
    );
  };

  if (loading && properties.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
          <p className="mt-1 text-gray-600">Manage your property listings</p>
        </div>
        <Link
          to="/landlord/add-property"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
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

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Building2 className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-800">
            No properties yet
          </h3>
          <p className="mt-1 text-gray-500">
            Create your first property listing to get started
          </p>
          <Link
            to="/landlord/add-property"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0].url || property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  {getStatusBadge(property)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold text-gray-800 line-clamp-1">
                  {property.title}
                </h3>
                <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {property.location?.city || "No location"}
                  </span>
                </div>

                {/* Details */}
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms || 1} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms || 1} bath</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 flex items-center gap-1 text-xl font-bold text-blue-600">
                  <DollarSign className="h-5 w-5" />
                  {property.rent?.toLocaleString() || 0}
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/properties/${property._id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  <Link
                    to={`/landlord/edit-property/${property._id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ open: true, property })}
                    className="flex items-center justify-center rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchProperties(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchProperties(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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

export default MyProperties;
