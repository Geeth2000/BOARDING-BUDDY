import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProperties } from "../../data/properties";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Search,
  SlidersHorizontal,
  Loader2,
  Home,
  ChevronDown,
  X,
} from "lucide-react";

/**
 * Properties Page
 * Display a grid of properties with search and filter
 */
const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((property) => property.type === filters.type);
    }

    // Price filters
    if (filters.minPrice) {
      result = result.filter(
        (property) => property.price >= parseInt(filters.minPrice),
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (property) => property.price <= parseInt(filters.maxPrice),
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
    "Apartment",
    "House",
    "Condo",
    "Studio",
    "Townhouse",
    "Loft",
    "Penthouse",
  ];

  const clearFilters = () => {
    setFilters({
      type: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "any",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms !== "any" ||
    searchTerm;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-center text-4xl font-bold md:text-5xl">
            Find Your Perfect Home
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-blue-100">
            Browse through our curated selection of quality properties
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location or property name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-4 font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
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
              <div className="mt-4 rounded-xl bg-white p-6 text-gray-900 shadow-lg">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Type Filter */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Property Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === "all" ? "All Types" : type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="No max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Bedrooms
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) =>
                        setFilters({ ...filters, bedrooms: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Properties
            </h2>
            <p className="mt-1 text-gray-600">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}{" "}
              found
            </p>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <Home className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No properties found
            </h3>
            <p className="mt-2 text-gray-600">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Property Card Component
 */
const PropertyCard = ({ property }) => {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {property.featured && (
          <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Featured
          </div>
        )}
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur-sm">
          {property.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-gray-500">/month</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Beds`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {property.area.toLocaleString()} sqft
            </span>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/properties/${property.id}`}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default Properties;
