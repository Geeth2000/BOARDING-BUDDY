import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landlordAPI from "../../api/landlord";
import {
  uploadMultipleFiles,
  validateFile,
  createPreviewUrl,
  revokePreviewUrl,
} from "../../utils/mediaUpload";
import {
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Image as ImageIcon,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
  Upload,
} from "lucide-react";

/**
 * Add Property Page
 * Form to create a new property listing
 */
const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "room",
    rent: "",
    bedrooms: 1,
    bathrooms: 1,
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    amenities: [],
    genderPreference: "any",
    availableFrom: "",
    utilities: {
      electricity: false,
      water: false,
      internet: false,
      gas: false,
      included: false,
    },
  });

  // Image files with previews
  const [imageFiles, setImageFiles] = useState([]);
  // Uploaded image URLs (stored in DB)
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const propertyTypes = [
    { value: "room", label: "Room" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "studio", label: "Studio" },
    { value: "shared", label: "Shared Space" },
  ];

  const amenitiesList = [
    "WiFi",
    "Air Conditioning",
    "Heating",
    "Washer/Dryer",
    "Parking",
    "Gym",
    "Pool",
    "Pet Friendly",
    "Furnished",
    "Kitchen",
    "Balcony",
    "Security",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else if (name.startsWith("utilities.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        utilities: { ...prev.utilities, [field]: checked },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max limit
    const totalImages = imageFiles.length + files.length;
    if (totalImages > 10) {
      setError(
        `You can only upload up to 10 images. Currently have ${imageFiles.length}.`,
      );
      return;
    }

    // Validate each file
    const validFiles = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(`${file.name}: ${validation.error}`);
        return;
      }
      validFiles.push({
        file,
        preview: createPreviewUrl(file),
        id: `${Date.now()}-${Math.random()}`,
      });
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setError("");

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove image file
  const removeImageFile = (id) => {
    setImageFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        revokePreviewUrl(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach((f) => revokePreviewUrl(f.preview));
    };
  }, []);

  // Upload images and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (
      !formData.title ||
      !formData.location.address ||
      !formData.location.city ||
      !formData.rent
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      let imageUrls = [];

      // Upload images to Supabase if any
      if (imageFiles.length > 0) {
        setUploading(true);
        setUploadProgress({ current: 0, total: imageFiles.length });

        const files = imageFiles.map((f) => f.file);
        imageUrls = await uploadMultipleFiles(
          files,
          "property-images",
          "properties",
          (current, total) => setUploadProgress({ current, total }),
        );

        setUploading(false);
      }

      // Create property with uploaded image URLs
      setLoading(true);
      const propertyData = {
        ...formData,
        rent: parseFloat(formData.rent),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        images: imageUrls.map((url) => ({ url })),
      };

      await landlordAPI.createProperty(propertyData);
      setSuccess("Property created successfully! Awaiting admin approval.");

      // Reset form after short delay
      setTimeout(() => {
        navigate("/landlord/properties");
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to create property",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
        <p className="mt-1 text-gray-600">
          List your property and start receiving booking requests
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Home className="h-5 w-5" />
            Basic Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Cozy Room Near Campus"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4" />
                Monthly Rent *
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="500"
                min="0"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Bed className="h-4 w-4" />
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                max="20"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Bath className="h-4 w-4" />
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                max="10"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Gender Preference
              </label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="any">Any</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <MapPin className="h-5 w-5" />
            Location
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Street Address *
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="New York"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="NY"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                placeholder="10001"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FileText className="h-5 w-5" />
            Description
          </h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your property, nearby amenities, rules, etc..."
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {formData.description.length}/2000 characters
          </p>
        </div>

        {/* Amenities */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  formData.amenities.includes(amenity)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Utilities Included
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {["electricity", "water", "internet", "gas"].map((utility) => (
              <label
                key={utility}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  name={`utilities.${utility}`}
                  checked={formData.utilities[utility]}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="capitalize text-gray-700">{utility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <ImageIcon className="h-5 w-5" />
            Property Images
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Upload images for your property (up to 10 images, JPG/PNG, max 5MB
            each)
          </p>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageFiles.length >= 10 || uploading}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-5 w-5" />
            {imageFiles.length === 0
              ? "Click to upload images"
              : `Add more images (${imageFiles.length}/10)`}
          </button>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4 rounded-xl bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  Uploading image {uploadProgress.current} of{" "}
                  {uploadProgress.total}...
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-200">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Image Previews */}
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Selected Images ({imageFiles.length}):
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {imageFiles.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={img.preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageFile(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/landlord/properties")}
            disabled={uploading || loading}
            className="rounded-xl px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading Images...
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5" />
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
