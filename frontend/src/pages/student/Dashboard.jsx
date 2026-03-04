import { useAuth } from "../../context";
import { Building2, CalendarCheck, Star, MessageSquare } from "lucide-react";

/**
 * Student Dashboard Page
 */
const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Saved Properties",
      value: "12",
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      name: "Active Bookings",
      value: "2",
      icon: CalendarCheck,
      color: "bg-green-500",
    },
    {
      name: "My Reviews",
      value: "5",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      name: "Unread Messages",
      value: "3",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-gray-600">
          Here's what's happening with your housing search.
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

      {/* Quick actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">Browse Properties</p>
              <p className="text-sm text-gray-500">
                Find your perfect accommodation
              </p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50">
            <CalendarCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium text-gray-800">View Bookings</p>
              <p className="text-sm text-gray-500">Check your booking status</p>
            </div>
          </button>
          <button className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50">
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium text-gray-800">Messages</p>
              <p className="text-sm text-gray-500">Chat with landlords</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
