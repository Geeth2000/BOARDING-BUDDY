import { useState, useEffect } from "react";
import { useAuth } from "../../context";
import { authAPI } from "../../api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/**
 * Profile Page
 * Edit user profile information
 */
const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "USA",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.updateProfile(formData);
      await checkAuth(); // Refresh user data
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-gray-600">
          Manage your personal information and profile settings
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Profile Photo
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a URL for your profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us a little about yourself..."
                maxLength={500}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <MapPin className="h-5 w-5" />
            Address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="NY"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="10001"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="USA"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Account Info (Read-only) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Role
              </p>
              <p className="mt-1 font-semibold capitalize text-gray-800">
                {user?.role || "User"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Status
              </p>
              <p className="mt-1 font-semibold text-gray-800">
                {user?.isVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Member Since
              </p>
              <p className="mt-1 font-semibold text-gray-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
