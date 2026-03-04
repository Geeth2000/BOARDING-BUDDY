import { useAuth } from "../../context";
import {
  Users,
  Building2,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

/**
 * Admin Dashboard Page
 */
const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Users",
      value: "1,248",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Total Properties",
      value: "342",
      icon: Building2,
      color: "bg-purple-500",
    },
    {
      name: "Active Bookings",
      value: "89",
      icon: CalendarCheck,
      color: "bg-green-500",
    },
    {
      name: "Total Revenue",
      value: "$24,580",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
  ];

  const pendingItems = [
    {
      type: "Property Approval",
      count: 5,
      icon: Building2,
      color: "text-blue-500 bg-blue-100",
    },
    {
      type: "Reported Reviews",
      count: 3,
      icon: AlertTriangle,
      color: "text-yellow-500 bg-yellow-100",
    },
    {
      type: "Verification Requests",
      count: 8,
      icon: Users,
      color: "text-purple-500 bg-purple-100",
    },
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.name}. Here's the platform overview.
        </p>
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
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending items */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Pending Actions
          </h2>
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-700">{item.type}</span>
                </div>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-700">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                user: "John Doe",
                time: "2 minutes ago",
                icon: Users,
                color: "text-blue-500 bg-blue-100",
              },
              {
                action: "Property approved",
                user: "Modern Studio Apt",
                time: "15 minutes ago",
                icon: CheckCircle,
                color: "text-green-500 bg-green-100",
              },
              {
                action: "Booking completed",
                user: "Booking #12345",
                time: "1 hour ago",
                icon: CalendarCheck,
                color: "text-purple-500 bg-purple-100",
              },
              {
                action: "New property submitted",
                user: "Cozy 2BR House",
                time: "2 hours ago",
                icon: Clock,
                color: "text-yellow-500 bg-yellow-100",
              },
              {
                action: "Review flagged",
                user: "Review #789",
                time: "3 hours ago",
                icon: AlertTriangle,
                color: "text-red-500 bg-red-100",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
              >
                <div className={`rounded-lg p-2 ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
