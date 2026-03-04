import {
  Shield,
  Eye,
  Lock,
  Target,
  Users,
  TrendingUp,
  Heart,
  Home,
  Lightbulb,
  Globe,
  Award,
} from "lucide-react";

/**
 * About Us Page - Boarding Buddy
 * Company information and mission
 */
const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust",
      description:
        "We verify every listing and landlord to ensure students can book with complete confidence. Your safety is our priority.",
      color: "blue",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "No hidden fees, no surprises. We believe in clear communication and honest pricing for both students and landlords.",
      color: "green",
    },
    {
      icon: Lock,
      title: "Safety",
      description:
        "From secure messaging to verified properties, we've built multiple layers of protection into every interaction.",
      color: "purple",
    },
  ];

  const team = [
    {
      name: "Ashan Fernando",
      role: "Founder & CEO",
      bio: "Former student housing advocate with 10+ years in property tech.",
      avatar: "AF",
    },
    {
      name: "Dilini Perera",
      role: "Head of Operations",
      bio: "Passionate about creating seamless experiences for students.",
      avatar: "DP",
    },
    {
      name: "Kavitha Jayawardena",
      role: "Trust & Safety Lead",
      bio: "Ensures every listing meets our strict verification standards.",
      avatar: "KJ",
    },
    {
      name: "Nuwan Silva",
      role: "Technology Lead",
      bio: "Building the platform that connects students with safe homes.",
      avatar: "NS",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <Home className="h-4 w-4" />
            About Boarding Buddy
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Making Student Accommodation{" "}
            <span className="text-blue-600">Safe & Simple</span>
          </h1>
          <p className="text-xl leading-relaxed text-gray-600">
            We're on a mission to transform how students find their home away
            from home. Every student deserves safe, verified, and affordable
            accommodation.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white shadow-xl sm:p-12">
            <Target className="mx-auto mb-6 h-12 w-12 opacity-90" />
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Our Mission</h2>
            <p className="text-lg leading-relaxed text-blue-100">
              To create a trusted ecosystem where every student can find safe,
              verified accommodation without stress, and every landlord can
              connect with responsible tenants. We believe finding a place to
              live during your studies should be exciting, not exhausting.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
              <Lightbulb className="h-4 w-4" />
              The Challenge
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              The Problem We Solve
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">For Students</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Difficulty finding verified, safe accommodations near campus
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Hidden costs and unexpected fees after moving in
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  No way to verify landlord authenticity or read real reviews
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Time-consuming search process during exam periods
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">
                For Landlords
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Hard to reach student tenants at the right time
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Managing inquiries through scattered channels
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  No platform designed specifically for student housing
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400"></span>
                  Difficulty showcasing property to verified students
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              <Award className="h-4 w-4" />
              Our Approach
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Solution
            </h2>
            <p className="text-lg text-gray-600">
              A purpose-built platform that addresses every pain point in
              student accommodation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Verified Listings Only
                </h3>
                <p className="text-gray-600">
                  Every property goes through our verification process. We check
                  ownership documents, visit locations, and ensure listings are
                  accurate and up-to-date.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Transparent Pricing
                </h3>
                <p className="text-gray-600">
                  See all costs upfront — rent, deposits, utilities, and any
                  additional fees. No surprises after you've signed the
                  agreement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Student Community Reviews
                </h3>
                <p className="text-gray-600">
                  Read authentic reviews from students who have actually lived
                  there. Make informed decisions based on real experiences from
                  your peers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Secure Communication
                </h3>
                <p className="text-gray-600">
                  Message landlords directly through our platform. Your contact
                  details stay private until you're ready to share them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Heart className="h-4 w-4" />
              What Drives Us
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide every decision we make.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${
                    value.color === "blue"
                      ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                      : value.color === "green"
                        ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                        : "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                  } transition-colors`}
                >
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Vision */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                  <TrendingUp className="h-4 w-4" />
                  Our Vision
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Growing Together
                </h2>
                <p className="mb-6 leading-relaxed text-gray-600">
                  We started with a simple idea: every student deserves a safe
                  place to live while pursuing their education. Today, we're
                  expanding across Sri Lanka with plans to serve students in
                  every major university city.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Expanding to 10+ cities by 2027
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      Serving 50,000+ students annually
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <Home className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      2,000+ verified properties
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="h-64 w-64 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600">
                        2026
                      </div>
                      <div className="mt-2 text-gray-600">And Beyond</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Users className="h-4 w-4" />
              The People Behind
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              Passionate people working to make student housing better for
              everyone.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white transition-transform group-hover:scale-105">
                  {member.avatar}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mb-3 text-sm font-medium text-blue-600">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Find Your Perfect Student Home?
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            Join thousands of students who've found safe accommodation through
            Boarding Buddy.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started Free
            </a>
            <a
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              Browse Listings
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
