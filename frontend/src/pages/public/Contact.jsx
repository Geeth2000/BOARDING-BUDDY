import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle,
} from "lucide-react";

/**
 * Contact Us Page - Boarding Buddy
 * Contact form and company information
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@boardingbuddy.com",
      secondary: "For general inquiries and support",
    },
    {
      icon: Phone,
      title: "Call Us",
      primary: "+94 11 234 5678",
      secondary: "Mon - Fri, 9:00 AM - 6:00 PM",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "123 Galle Road, Colombo 03",
      secondary: "Sri Lanka",
    },
    {
      icon: Clock,
      title: "Business Hours",
      primary: "Monday - Friday",
      secondary: "9:00 AM - 6:00 PM (IST)",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <MessageSquare className="h-4 w-4" />
            Get In Touch
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have questions about Boarding Buddy? We're here to help. Reach out
            to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Side - Contact Information */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Contact Information
              </h2>
              <p className="mb-8 text-gray-600">
                Whether you're a student looking for accommodation or a landlord
                wanting to list your property, our team is ready to assist you.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-medium text-blue-600">
                        {item.primary}
                      </p>
                      <p className="text-sm text-gray-500">{item.secondary}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                    <p className="text-sm text-gray-500">
                      Interactive map coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Send us a Message
                </h2>
                <p className="mb-6 text-gray-600">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>
                      Thank you! Your message has been sent successfully.
                    </span>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="booking">Booking Issue</option>
                      <option value="listing">Property Listing</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                  By submitting this form, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Looking for Quick Answers?
          </h2>
          <p className="mb-6 text-gray-600">
            Check out our frequently asked questions for immediate help with
            common topics.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-medium text-blue-600 transition-all hover:bg-blue-50"
          >
            Visit FAQ Center
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
