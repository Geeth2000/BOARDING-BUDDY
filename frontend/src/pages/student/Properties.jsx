import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import studentAPI from "../../api/student";
import { formatLKR } from "../../utils/currency";
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Search,
  Loader2,
  Home,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Student Browse Properties Page
 * Display approved properties with search and filter
 */
const StudentProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
  });

  // Get unique locations from properties
  const uniqueLocations = [
    ...new Set(properties.map((p) => p.location?.city).filter(Boolean)),
  ].sort();

  // Fetch properties from API
  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await studentAPI.getProperties();
      if (data.success) {
        setProperties(data.data || []);
        setFilteredProperties(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply frontend filters
  useEffect(() => {
    let result = [...properties];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.title?.toLowerCase().includes(term) ||
          property.location?.city?.toLowerCase().includes(term) ||
          property.location?.address?.toLowerCase().includes(term) ||
          property.location?.district?.toLowerCase().includes(term),
      );
    }

    // Location filter
    if (filters.location !== "all") {
      result = result.filter(
        (property) =>
          property.location?.city?.toLowerCase() ===
          filters.location.toLowerCase(),
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter(
        (property) =>
          property.propertyType?.toLowerCase() === filters.type.toLowerCase(),
      );
    }

    // Price filters
    if (filters.minPrice) {
      result = result.filter(
        (property) => property.rent >= parseInt(filters.minPrice),
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (property) => property.rent <= parseInt(filters.maxPrice),
      );
    }

    // Bedrooms filter
    if (filters.bedrooms !== "any") {
      const beds = parseInt(filters.bedrooms);
      if (beds === 4) {
        result = result.filter((property) => property.bedrooms >= 4);
      } else {
        result = result.filter((property) => property.bedrooms === beds);
      }
    }

    setFilteredProperties(result);
  }, [searchTerm, filters, properties]);

  const propertyTypes = [
    "all",
    "room",
    "apartment",
    "house",
    "studio",
    "shared",
  ];

  const clearFilters = () => {
    setFilters({
      type: "all",
      location: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "any",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.location !== "all" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms !== "any" ||
    searchTerm;

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
        <Home className="h-16 w-16 text-red-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Failed to load properties
        </h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={fetchProperties}
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
        <h1 className="text-2xl font-bold text-gray-800">Browse Properties</h1>
        <p className="mt-1 text-gray-600">
          Find your perfect student accommodation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location or property name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Location Filter */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Min Price (Rs.)
              </label>
              <input
                type="number"
                placeholder="Rs. 0"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Max Price (Rs.)
              </label>
              <input
                type="number"
                placeholder="No max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters({ ...filters, bedrooms: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="any">Any</option>
                <option value="0">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredProperties.length}{" "}
          {filteredProperties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Building2 className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No properties found
          </h3>
          <p className="mt-1 text-gray-600">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Property Card Component
 */
const PropertyCard = ({ property }) => {
  const getImageUrl = () => {
    if (!property.images || property.images.length === 0) return null;
    const firstImage = property.images[0];
    return typeof firstImage === "string" ? firstImage : firstImage?.url;
  };

  const imageUrl = getImageUrl();

  const getLocationString = () => {
    if (typeof property.location === "string") return property.location;
    return (
      property.location?.city ||
      property.location?.address ||
      "Location not specified"
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium capitalize text-gray-700 shadow">
          {property.propertyType || "Property"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-xl font-bold text-blue-600">
            {formatLKR(property.rent || 0)}
          </span>
          <span className="text-sm text-gray-500">/month</span>
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {property.title}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{getLocationString()}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>
              {property.bedrooms === 0
                ? "Studio"
                : `${property.bedrooms} Bed${property.bedrooms !== 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>
              {property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <Link
          to={`/properties/${property._id}`}
          className="mt-4 block w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default StudentProperties;
