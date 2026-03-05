import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Banknote,
  Bed,
  Bath,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
  Upload,
  ArrowLeft,
} from "lucide-react";

/**
 * Edit Property Page
 * Form to edit an existing property listing
 */
const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
      district: "",
      postalCode: "",
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

  // New image files with previews (to be uploaded)
  const [imageFiles, setImageFiles] = useState([]);
  // Existing image URLs from the property
  const [existingImages, setExistingImages] = useState([]);

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

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await landlordAPI.getProperty(id);
        if (data.success && data.data) {
          const property = data.data;

          // Populate form with existing data
          setFormData({
            title: property.title || "",
            propertyType: property.propertyType || "room",
            rent: property.rent || "",
            bedrooms: property.bedrooms || 1,
            bathrooms: property.bathrooms || 1,
            description: property.description || "",
            location: {
              address: property.location?.address || "",
              city: property.location?.city || "",
              district: property.location?.district || "",
              postalCode: property.location?.postalCode || "",
            },
            amenities: property.amenities || [],
            genderPreference: property.genderPreference || "any",
            availableFrom: property.availableFrom
              ? new Date(property.availableFrom).toISOString().split("T")[0]
              : "",
            utilities: {
              electricity: property.utilities?.electricity || false,
              water: property.utilities?.water || false,
              internet: property.utilities?.internet || false,
              gas: property.utilities?.gas || false,
              included: property.utilities?.included || false,
            },
          });

          // Set existing images
          if (property.images && property.images.length > 0) {
            setExistingImages(
              property.images.map((img, index) => ({
                id: `existing-${index}`,
                url: typeof img === "string" ? img : img.url,
              })),
            );
          }
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(
          err.response?.data?.message || "Failed to load property details",
        );
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id]);

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

    // Check max limit (existing + new)
    const totalImages =
      existingImages.length + imageFiles.length + files.length;
    if (totalImages > 10) {
      setError(
        `You can only have up to 10 images. Currently have ${existingImages.length + imageFiles.length}.`,
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
        id: `new-${Date.now()}-${Math.random()}`,
      });
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setError("");

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove new image file
  const removeImageFile = (id) => {
    setImageFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        revokePreviewUrl(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Remove existing image
  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
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
      let newImageUrls = [];

      // Upload new images to Supabase if any
      if (imageFiles.length > 0) {
        setUploading(true);
        setUploadProgress({ current: 0, total: imageFiles.length });

        const files = imageFiles.map((f) => f.file);
        newImageUrls = await uploadMultipleFiles(
          files,
          "images2",
          "properties",
          (current, total) => setUploadProgress({ current, total }),
        );

        setUploading(false);
      }

      // Combine existing and new images
      const allImages = [
        ...existingImages.map((img) => ({ url: img.url })),
        ...newImageUrls.map((url) => ({ url })),
      ];

      // Update property with data
      setLoading(true);
      const propertyData = {
        ...formData,
        rent: parseFloat(formData.rent),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        images: allImages,
      };

      await landlordAPI.updateProperty(id, propertyData);
      setSuccess("Property updated successfully! Awaiting admin re-approval.");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/landlord/properties");
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to update property",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/landlord/properties")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Properties
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
        <p className="mt-1 text-gray-600">
          Update your property details. Changes will require admin re-approval.
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
                <Banknote className="h-4 w-4" />
                Monthly Rent (Rs.) *
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="50000"
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
                placeholder="Colombo"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                placeholder="Colombo"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="location.postalCode"
                value={formData.location.postalCode}
                onChange={handleChange}
                placeholder="10000"
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
            Manage your property images (up to 10 images, JPG/PNG, max 5MB each)
          </p>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Current Images ({existingImages.length}):
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={img.url}
                      alt="Property"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            disabled={
              existingImages.length + imageFiles.length >= 10 || uploading
            }
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-5 w-5" />
            {existingImages.length + imageFiles.length === 0
              ? "Click to upload images"
              : `Add more images (${existingImages.length + imageFiles.length}/10)`}
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

          {/* New Image Previews */}
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                New Images to Upload ({imageFiles.length}):
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
                Updating...
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5" />
                Update Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
