import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context";
import studentAPI from "../../api/student";
import {
  Building2,
  CalendarCheck,
  Star,
  MessageSquare,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

/**
 * Student Dashboard Page
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalReviews: 0,
    unreadMessages: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, reviewsRes, unreadRes] = await Promise.all([
          studentAPI.getBookings(),
          studentAPI.getReviews(),
          studentAPI.getUnreadCount(),
        ]);

        const bookings = bookingsRes.data?.data || [];
        const reviews = reviewsRes.data?.data || [];
        const unreadCount = unreadRes.data?.data?.unreadCount || 0;

        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === "pending")
            .length,
          approvedBookings: bookings.filter((b) => b.status === "approved")
            .length,
          totalReviews: reviews.length,
          unreadMessages: unreadCount,
        });

        // Get 3 most recent bookings
        setRecentBookings(bookings.slice(0, 3));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      icon: Building2,
      color: "bg-blue-500",
      link: "/student/bookings",
    },
    {
      name: "Pending Requests",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-yellow-500",
      link: "/student/bookings",
    },
    {
      name: "My Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "bg-purple-500",
      link: "/student/reviews",
    },
    {
      name: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "bg-green-500",
      link: "/student/messages",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "rejected":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" };
    }
  };

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
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
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
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <Link
            to="/student/bookings"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarCheck className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">No bookings yet</p>
            <Link
              to="/student/properties"
              className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={booking._id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.propertyId?.title || "Property"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${statusConfig.bg}`}
                  >
                    <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                    <span
                      className={`text-sm font-medium capitalize ${statusConfig.color}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/student/properties"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
          >
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium text-gray-800">Browse Properties</p>
              <p className="text-sm text-gray-500">
                Find your perfect accommodation
              </p>
            </div>
          </Link>
          <Link
            to="/student/bookings"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50"
          >
            <CalendarCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium text-gray-800">View Bookings</p>
              <p className="text-sm text-gray-500">Check your booking status</p>
            </div>
          </Link>
          <Link
            to="/student/messages"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium text-gray-800">Messages</p>
              <p className="text-sm text-gray-500">Chat with landlords</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
