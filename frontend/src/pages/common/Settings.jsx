import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { authAPI } from "../../api";
import { ConfirmModal } from "../../components";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Globe,
  Moon,
  Mail,
  MessageSquare,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

/**
 * Settings Page
 * Manage account settings, notifications, and security
 */
const Settings = () => {
  const { user, checkAuth, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Settings form
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    darkMode: false,
    language: "en",
    timezone: "America/New_York",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete account
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setSettings({
        emailNotifications: user.settings.emailNotifications ?? true,
        smsNotifications: user.settings.smsNotifications ?? false,
        marketingEmails: user.settings.marketingEmails ?? false,
        darkMode: user.settings.darkMode ?? false,
        language: user.settings.language || "en",
        timezone: user.settings.timezone || "America/New_York",
      });
    }
  }, [user]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.updateSettings(settings);
      await checkAuth();
      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Please enter your password to confirm");
      return;
    }

    setDeleting(true);
    try {
      await authAPI.deleteAccount({ password: deletePassword });
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account settings and preferences
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

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 rounded-2xl bg-white p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                } ${tab.id === "danger" ? "text-red-600 hover:bg-red-50" : ""}`}
              >
                <tab.icon
                  className={`h-5 w-5 ${
                    tab.id === "danger" && activeTab !== tab.id
                      ? "text-red-500"
                      : ""
                  }`}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <form
              onSubmit={handleSettingsSubmit}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Bell className="h-5 w-5" />
                Notification Settings
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive booking updates and messages via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        SMS Notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive urgent updates via text message
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          smsNotifications: e.target.checked,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        Marketing Emails
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive news, tips, and special offers
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.marketingEmails}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          marketingEmails: e.target.checked,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Lock className="h-5 w-5" />
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    At least 6 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <form
              onSubmit={handleSettingsSubmit}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Globe className="h-5 w-5" />
                Preferences
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <Moon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Dark Mode</p>
                      <p className="text-sm text-gray-500">
                        Use dark theme across the application
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          darkMode: e.target.checked,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </h2>
              <div className="rounded-xl bg-white p-4">
                <h3 className="font-medium text-gray-800">Delete Account</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Once you delete your account, there is no going back. All your
                  data, properties, bookings, and reviews will be permanently
                  removed.
                </p>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Account
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This action is irreversible. Please enter your password to
              confirm.
            </p>
            <div className="mt-4">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeletePassword("");
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
