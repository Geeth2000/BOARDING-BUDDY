import { useAuth } from "../../context";
import {
  Building2,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Plus,
} from "lucide-react";

/**
 * Landlord Dashboard Page
 */
const LandlordDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Properties",
      value: "8",
      icon: Building2,
      color: "bg-blue-500",
      trend: "+2 this month",
    },
    {
      name: "Active Bookings",
      value: "15",
      icon: CalendarCheck,
      color: "bg-green-500",
      trend: "+5 this month",
    },
    {
      name: "Monthly Revenue",
      value: "$4,250",
      icon: DollarSign,
      color: "bg-emerald-500",
      trend: "+12% vs last month",
    },
    {
      name: "Occupancy Rate",
      value: "87%",
      icon: TrendingUp,
      color: "bg-purple-500",
      trend: "+3% this month",
    },
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Here's an overview of your properties and bookings.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-3xl font-bold text-gray-800">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-green-600">{stat.trend}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending booking requests */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Pending Booking Requests
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                    S{i}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Student Name {i}
                    </p>
                    <p className="text-sm text-gray-500">
                      Property {i} • 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200">
                    Accept
                  </button>
                  <button className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Reviews
          </h2>
          <div className="space-y-4">
            {[
              { rating: 5, comment: "Great place to stay!" },
              { rating: 4, comment: "Very clean and comfortable." },
              { rating: 5, comment: "Excellent landlord, highly recommend!" },
            ].map((review, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className={`h-4 w-4 ${
                        j < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
