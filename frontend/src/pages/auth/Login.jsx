import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { AuthInput } from "../../components";
import {
  Mail,
  Lock,
  Home,
  Shield,
  Star,
  Users,
  Loader2,
  ArrowRight,
} from "lucide-react";

/**
 * Login Page
 * Modern SaaS authentication UI
 */
const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Navigate based on role
        const role = result.user?.role;
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "landlord":
            navigate("/landlord/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

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
            Find Safe & Verified Student Boarding
          </h1>
          <p className="mb-8 text-lg text-blue-100">
            Join thousands of students who have found their perfect home away
            from home. Verified listings, transparent pricing, and secure
            communication.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">500+</div>
                <div className="text-sm text-blue-200">Verified Listings</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">5,000+</div>
                <div className="text-sm text-blue-200">Happy Students</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">4.8</div>
                <div className="text-sm text-blue-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Testimonial */}
        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
          <p className="mb-4 text-blue-50">
            "Boarding Buddy made finding accommodation so easy! Found a verified
            place near campus in just two days."
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-semibold text-white">
              SJ
            </div>
            <div>
              <div className="font-medium text-white">Sarah Johnson</div>
              <div className="text-sm text-blue-200">Medical Student, UoC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-gray-600">
                Sign in to continue to your dashboard
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
              <AuthInput
                id="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
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

export default Login;
