import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { AuthInput } from "../../components";
import {
  User,
  Mail,
  Lock,
  Home,
  Shield,
  CheckCircle,
  Loader2,
  ArrowRight,
  GraduationCap,
  Building2,
} from "lucide-react";

/**
 * Register Page
 * Modern SaaS authentication UI
 */
const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate password complexity (must match backend requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least one lowercase, one uppercase, and one number",
      );
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (result.success) {
        const role = result.user?.role;
        switch (role) {
          case "landlord":
            navigate("/landlord/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const benefits = [
    "Access to 500+ verified student accommodations",
    "Direct communication with landlords",
    "Authentic reviews from fellow students",
    "Secure and transparent booking process",
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Boarding Buddy
            </span>
          </Link>
        </div>

        {/* Center Content */}
        <div className="max-w-lg">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white">
            Join the Trusted Student Housing Community
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            Create your free account and start your journey to finding the
            perfect student accommodation or listing your property.
          </p>

          {/* Benefits List */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-blue-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom - Trust Indicators */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-200" />
            <div>
              <div className="font-semibold text-white">Verified Platform</div>
              <div className="text-sm text-blue-200">All listings checked</div>
            </div>
          </div>
          <div className="h-12 w-px bg-white/20" />
          <div className="flex items-center gap-3">
            <Lock className="h-8 w-8 text-blue-200" />
            <div>
              <div className="font-semibold text-white">Secure & Private</div>
              <div className="text-sm text-blue-200">Your data protected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Boarding Buddy
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Create account
              </h2>
              <p className="mt-2 text-gray-600">
                Get started with your free account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "student" })
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-medium transition-all ${
                      formData.role === "student"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <GraduationCap className="h-5 w-5" />
                    Find Housing
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "landlord" })
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-medium transition-all ${
                      formData.role === "landlord"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    List Property
                  </button>
                </div>
              </div>

              {/* Name */}
              <AuthInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
                autoComplete="name"
              />

              {/* Email */}
              <AuthInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                autoComplete="email"
              />

              {/* Password */}
              <div>
                <AuthInput
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  autoComplete="new-password"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Min 6 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password */}
              <AuthInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                autoComplete="new-password"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
