const Booking = require("../models/Booking");
const User = require("../models/User");
const Property = require("../models/Property");
const { asyncHandler, successResponse } = require("../utils");

/**
 * @desc    Get dashboard overview stats
 * @route   GET /api/analytics/overview
 * @access  Private/Admin
 */
const getOverview = asyncHandler(async (req, res) => {
  const [bookingStats, userStats, propertyStats] = await Promise.all([
    // Booking aggregation
    Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, "$rent", 0],
            },
          },
          totalCommission: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, "$commissionAmount", 0],
            },
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          approvedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejectedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
    ]),
    // User counts by role
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
    // Property stats
    Property.aggregate([
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          approvedProperties: {
            $sum: { $cond: [{ $eq: ["$isApproved", true] }, 1, 0] },
          },
          pendingProperties: {
            $sum: { $cond: [{ $eq: ["$isApproved", false] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  // Format user stats
  const users = {
    total: 0,
    students: 0,
    landlords: 0,
    admins: 0,
  };
  userStats.forEach((stat) => {
    users[`${stat._id}s`] = stat.count;
    users.total += stat.count;
  });

  const overview = {
    bookings: bookingStats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      totalCommission: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      rejectedBookings: 0,
    },
    users,
    properties: propertyStats[0] || {
      totalProperties: 0,
      approvedProperties: 0,
      pendingProperties: 0,
    },
  };

  successResponse(res, 200, "Analytics overview retrieved", overview);
});

/**
 * @desc    Get monthly revenue and booking growth
 * @route   GET /api/analytics/monthly
 * @access  Private/Admin
 */
const getMonthlyStats = asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

  const monthlyData = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: monthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalBookings: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [{ $eq: ["$status", "approved"] }, "$rent", 0],
          },
        },
        commission: {
          $sum: {
            $cond: [{ $eq: ["$status", "approved"] }, "$commissionAmount", 0],
          },
        },
        approved: {
          $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalBookings: 1,
        revenue: 1,
        commission: 1,
        approved: 1,
        rejected: 1,
        pending: 1,
      },
    },
  ]);

  // Calculate growth rates
  const withGrowth = monthlyData.map((current, index) => {
    if (index === 0) {
      return { ...current, revenueGrowth: 0, bookingGrowth: 0 };
    }
    const previous = monthlyData[index - 1];
    const revenueGrowth = previous.revenue
      ? ((current.revenue - previous.revenue) / previous.revenue) * 100
      : 0;
    const bookingGrowth = previous.totalBookings
      ? ((current.totalBookings - previous.totalBookings) /
          previous.totalBookings) *
        100
      : 0;
    return {
      ...current,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      bookingGrowth: Math.round(bookingGrowth * 100) / 100,
    };
  });

  successResponse(res, 200, "Monthly statistics retrieved", withGrowth);
});

/**
 * @desc    Get booking statistics breakdown
 * @route   GET /api/analytics/bookings
 * @access  Private/Admin
 */
const getBookingStats = asyncHandler(async (req, res) => {
  const [statusBreakdown, dailyBookings, topProperties] = await Promise.all([
    // Status breakdown
    Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRent: { $sum: "$rent" },
          avgRent: { $avg: "$rent" },
        },
      },
    ]),
    // Daily bookings for last 30 days
    Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Top properties by bookings
    Booking.aggregate([
      {
        $group: {
          _id: "$propertyId",
          bookingCount: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "approved"] }, "$rent", 0],
            },
          },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        $project: {
          _id: 0,
          propertyId: "$_id",
          title: "$property.title",
          bookingCount: 1,
          totalRevenue: 1,
        },
      },
    ]),
  ]);

  // Format status breakdown
  const statusStats = {};
  statusBreakdown.forEach((stat) => {
    statusStats[stat._id] = {
      count: stat.count,
      totalRent: Math.round(stat.totalRent * 100) / 100,
      avgRent: Math.round(stat.avgRent * 100) / 100,
    };
  });

  // Calculate conversion rate
  const total = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  const approved = statusStats.approved?.count || 0;
  const conversionRate = total
    ? Math.round((approved / total) * 10000) / 100
    : 0;

  successResponse(res, 200, "Booking statistics retrieved", {
    statusBreakdown: statusStats,
    conversionRate,
    dailyBookings,
    topProperties,
  });
});

/**
 * @desc    Get revenue breakdown
 * @route   GET /api/analytics/revenue
 * @access  Private/Admin
 */
const getRevenueStats = asyncHandler(async (req, res) => {
  const [revenueByLandlord, commissionTrend] = await Promise.all([
    // Revenue by top landlords
    Booking.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$landlordId",
          totalRevenue: { $sum: "$rent" },
          totalCommission: { $sum: "$commissionAmount" },
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "landlord",
        },
      },
      { $unwind: "$landlord" },
      {
        $project: {
          _id: 0,
          landlordId: "$_id",
          name: "$landlord.name",
          email: "$landlord.email",
          totalRevenue: 1,
          totalCommission: 1,
          bookingCount: 1,
        },
      },
    ]),
    // Commission trend (last 6 months)
    Booking.aggregate([
      {
        $match: {
          status: "approved",
          createdAt: {
            $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          commission: { $sum: "$commissionAmount" },
          revenue: { $sum: "$rent" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          commission: 1,
          revenue: 1,
        },
      },
    ]),
  ]);

  // Calculate totals
  const totalRevenue = revenueByLandlord.reduce(
    (sum, l) => sum + l.totalRevenue,
    0,
  );
  const totalCommission = revenueByLandlord.reduce(
    (sum, l) => sum + l.totalCommission,
    0,
  );

  successResponse(res, 200, "Revenue statistics retrieved", {
    summary: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      commissionRate: "8%",
    },
    topLandlords: revenueByLandlord,
    commissionTrend,
  });
});

/**
 * @desc    Get user growth statistics
 * @route   GET /api/analytics/users
 * @access  Private/Admin
 */
const getUserStats = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

  const [userGrowth, roleDistribution, recentUsers] = await Promise.all([
    // User growth by month
    User.aggregate([
      {
        $match: { createdAt: { $gte: monthsAgo } },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    // Role distribution
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
    // Recent users
    User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  // Format role distribution
  const roles = {};
  let totalUsers = 0;
  roleDistribution.forEach((r) => {
    roles[r._id] = r.count;
    totalUsers += r.count;
  });

  successResponse(res, 200, "User statistics retrieved", {
    totalUsers,
    roleDistribution: roles,
    userGrowth,
    recentUsers,
  });
});

module.exports = {
  getOverview,
  getMonthlyStats,
  getBookingStats,
  getRevenueStats,
  getUserStats,
};
