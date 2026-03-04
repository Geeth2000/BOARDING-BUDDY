import { Link } from "react-router-dom";
import {
  Shield,
  DollarSign,
  Star,
  MessageCircle,
  Search,
  ClipboardCheck,
  Key,
  Home,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

/**
 * Landing Page - Boarding Buddy
 * Modern SaaS landing page for student accommodation platform
 */
const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description:
        "Every property is personally verified by our team to ensure safety, quality, and accurate information for students.",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description:
        "No hidden fees or surprises. See exact costs upfront including rent, utilities, and deposits before you commit.",
    },
    {
      icon: Star,
      title: "Student Reviews",
      description:
        "Read authentic reviews from fellow students who have lived there. Make informed decisions based on real experiences.",
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description:
        "Chat directly with landlords through our secure platform. Your personal information stays protected.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Search Properties",
      description:
        "Browse verified listings near your university. Filter by price, amenities, and distance from campus.",
    },
    {
      number: "02",
      icon: ClipboardCheck,
      title: "Compare & Shortlist",
      description:
        "Save your favorites, compare features side-by-side, and read reviews from other students.",
    },
    {
      number: "03",
      icon: MessageCircle,
      title: "Connect with Landlords",
      description:
        "Message landlords directly, ask questions, and schedule viewings at your convenience.",
    },
    {
      number: "04",
      icon: Key,
      title: "Book Your Place",
      description:
        "Secure your accommodation with our safe booking system. Move in with peace of mind.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Medical Student, University of Colombo",
      content:
        "Boarding Buddy made finding accommodation so easy! I found a verified place within walking distance of my campus in just two days. The reviews from other students helped me make the right choice.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Kavinda Perera",
      role: "Engineering Student, University of Moratuwa",
      content:
        "As an out-of-station student, I was worried about finding safe accommodation. This platform connected me with a trustworthy landlord and the transparent pricing meant no surprises.",
      rating: 5,
      avatar: "KP",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <Shield className="h-4 w-4" />
                Trusted by 5,000+ Students
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Find Safe &{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Verified
                </span>{" "}
                Student Boarding
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
                Discover quality accommodations near your university. All
                listings are verified, reviews are authentic, and booking is
                secure. Your perfect student home is just a click away.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                >
                  <Search className="h-5 w-5" />
                  Find Boarding
                </Link>
                <Link
                  to="/register?role=landlord"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Home className="h-5 w-5" />
                  List Your Property
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Verified Listings</div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8★</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24h</div>
                  <div className="text-sm text-gray-500">Response Time</div>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 p-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Property Card 1 */}
                  <div className="rounded-xl bg-white p-4 shadow-lg transition-transform hover:scale-105">
                    <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-blue-200 to-blue-100"></div>
                    <div className="mb-1 text-sm font-semibold text-gray-900">
                      Modern Studio
                    </div>
                    <div className="text-xs text-gray-500">Near UoC</div>
                    <div className="mt-2 text-sm font-bold text-blue-600">
                      Rs. 15,000/mo
                    </div>
                  </div>
                  {/* Property Card 2 */}
                  <div className="mt-6 rounded-xl bg-white p-4 shadow-lg transition-transform hover:scale-105">
                    <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-100"></div>
                    <div className="mb-1 text-sm font-semibold text-gray-900">
                      Shared Room
                    </div>
                    <div className="text-xs text-gray-500">Bambalapitiya</div>
                    <div className="mt-2 text-sm font-bold text-blue-600">
                      Rs. 8,000/mo
                    </div>
                  </div>
                  {/* Property Card 3 */}
                  <div className="-mt-2 rounded-xl bg-white p-4 shadow-lg transition-transform hover:scale-105">
                    <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-indigo-200 to-indigo-100"></div>
                    <div className="mb-1 text-sm font-semibold text-gray-900">
                      Private Annex
                    </div>
                    <div className="text-xs text-gray-500">Moratuwa</div>
                    <div className="mt-2 text-sm font-bold text-blue-600">
                      Rs. 20,000/mo
                    </div>
                  </div>
                  {/* Verified Badge */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background Decorations */}
              <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Why Choose Us
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Find Your Perfect Stay
            </h2>
            <p className="text-lg text-gray-600">
              We've built the most trusted platform for students to find safe,
              affordable, and quality accommodation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Simple Process
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How Boarding Buddy Works
            </h2>
            <p className="text-lg text-gray-600">
              Find and book your ideal student accommodation in just four simple
              steps.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Connection Line */}
            <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"></div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  {/* Step Number */}
                  <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 ring-blue-50">
                    <step.icon className="h-8 w-8 text-blue-600" />
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              Student Reviews
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by Students Across the Country
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it. Here's what students have to say
              about their experience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:shadow-lg"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
                  "
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Find Your Perfect Student Home?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of students who've found safe, verified
              accommodation through Boarding Buddy. Start your search today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Started Free
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Boarding Buddy
                </span>
              </div>
              <p className="mb-6 text-gray-400">
                The trusted platform for finding safe, verified student
                accommodation near universities across the country.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/properties"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Browse Listings
                  </Link>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    to="/register?role=landlord"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    List Your Property
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="h-5 w-5 text-blue-500" />
                  support@boardingbuddy.com
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-5 w-5 text-blue-500" />
                  +94 11 234 5678
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>
                    123 Galle Road
                    <br />
                    Colombo 03, Sri Lanka
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Boarding Buddy. All rights
                reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="#"
                  className="text-gray-500 transition-colors hover:text-gray-400"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-500 transition-colors hover:text-gray-400"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-500 transition-colors hover:text-gray-400"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
