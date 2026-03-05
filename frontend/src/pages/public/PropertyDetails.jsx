import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPropertyById } from "../../data/properties";
import { PropertyDetailsNavbar } from "../../components";
import { formatLKR } from "../../utils/currency";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  Check,
  Home,
  X,
} from "lucide-react";

/**
 * Property Details Page
 * Shows full property information with image carousel
 */
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1,
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Home className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Property Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The property you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Property Details Navbar */}
      <PropertyDetailsNavbar
        onSave={() => setIsFavorited(!isFavorited)}
        onShare={handleShare}
        isSaved={isFavorited}
      />

      {/* Image Carousel */}
      <div className="relative bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Carousel Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:bg-white hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {property.images.length > 1 && (
          <div className="bg-gray-900 py-4">
            <div className="mx-auto flex max-w-7xl justify-center gap-3 px-4">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`h-16 w-24 overflow-hidden rounded-lg transition-all ${
                    index === currentImageIndex
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header Info */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {property.type}
                    </span>
                    {property.featured && (
                      <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-sm font-medium text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                    {property.title}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatLKR(property.price)}
                  </div>
                  <div className="text-gray-500">per month</div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Bed className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">
                      {property.bedrooms === 0 ? "Studio" : property.bedrooms}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.bedrooms === 0
                      ? ""
                      : property.bedrooms === 1
                        ? "Bedroom"
                        : "Bedrooms"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Bath className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">
                      {property.bathrooms}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Square className="h-5 w-5 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">
                      {property.area.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
              <div className="mt-4 flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-blue-400" />
                  <p className="mt-2 font-medium text-gray-600">
                    {property.location}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* Contact Agent Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">
                  Interested in this property?
                </h3>
                <p className="mt-2 text-gray-600">
                  Contact our agent to schedule a viewing or get more
                  information.
                </p>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contact Agent
                </button>

                <div className="mt-6 space-y-4">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Call us</div>
                      <div className="font-medium text-gray-900">
                        +1 (234) 567-890
                      </div>
                    </div>
                  </a>
                  <a
                    href="mailto:agent@boardingbuddy.com"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">
                        agent@boardingbuddy.com
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Similar Properties Prompt */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <h3 className="font-semibold text-gray-900">
                  Looking for more options?
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Browse our full collection of properties to find your perfect
                  home.
                </p>
                <Link
                  to="/properties"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all properties
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          property={property}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

/**
 * Contact Modal Component
 */
const ContactModal = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in "${property.title}" listed at ${formatLKR(property.price)}/month. I would like to schedule a viewing.`,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Message Sent!
            </h3>
            <p className="mt-2 text-gray-600">
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Contact Agent</h3>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;
