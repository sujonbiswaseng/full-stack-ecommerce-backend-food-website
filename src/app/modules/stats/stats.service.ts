import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../middleware/auth.const";
import { PaymentStatus } from "../../../generated/prisma/enums";

const getDashboardStatsData = async (user: IRequestUser) => {
  // Check if user exists (based on userId)
  const userExists = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (!userExists) {
    throw new AppError(status.NOT_FOUND, "User does not exist");
  }
  let statsData;
  switch (user.role) {
    case UserRoles.Admin:
      statsData = getAdminDashboardStats();
      break;
    case UserRoles.Provider:
      statsData = getProviderDashboardStats(userExists.id);
      break;
    default:
      throw new AppError(status.BAD_REQUEST, "Invalid user role");
  }

  return statsData;
};
interface IBarChartData {
  month: string;
  revenue: number;
}

export const getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.meal.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.review.count(),
      prisma.payment.count(),
    ]);

    const [mealsCount, userCount, orderCount, reviewCount, paymentCount] = counts;
    // 🔹 Event Status Counts
    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { status: "APPROVED" } }),
      prisma.meal.count({ where: { status: "PENDING" } }),
      prisma.meal.count({ where: { status: "REJECTED" } }),
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "PLACED" } }),
      prisma.order.count({ where: { status: "PREPARING" } }),
      prisma.order.count({ where: { status: "READY" } }),
    ]);

    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID },
    });
    const totalRevenue = revenueResult._sum.amount ?? 0;

    const payments = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
      select: { amount: true, createdAt: true },
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue: Record<number, number> = {};

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
    });

    const barChartData: IBarChartData[] = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0,
    }));
    return {
      counts: {
        mealsCount: mealsCount,
        orderCount,
        reviewCount,
        userCount,
        paymentCount
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder,
      },
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      // pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};

interface IBarChartData {
  month: string;
  revenue: number;
}

export const getProviderDashboardStats = async (userId: string) => {
  try {
    const provider = await prisma.user.findUnique({
      where: { id:userId },
      select: { id: true }
    });

    if (!provider) {
      throw new Error("Provider not found");
    }
    const counts = await prisma.$transaction([
      prisma.meal.count({
        where: { provider: { userId } }
      }),
      prisma.order.count({
        where: { provider: { userId } }
      }),
    ]);
    const [mealsCount, orderCount] = counts;

    const [approvedmeals, pendingmeals, rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { provider: { userId }, status: "APPROVED" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "PENDING" } }),
      prisma.meal.count({ where: { provider: { userId }, status: "REJECTED" } }),
    ]);
    const [cancelledorder, deliveredorder, placedorder, preparingorder, readyorder] = await Promise.all([
      prisma.order.count({ where: { provider: { userId }, status: "CANCELLED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "DELIVERED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PLACED" } }),
      prisma.order.count({ where: { provider: { userId }, status: "PREPARING" } }),
      prisma.order.count({ where: { provider: { userId }, status: "READY" } }),
    ]);
    const providerOrders = await prisma.order.findMany({
      where: {
        provider: { userId }
      },
      select: { id: true }
    });
    const orderIds = providerOrders.map(order => order.id);

    let totalRevenue = 0;
    let barChartData: IBarChartData[] = [];
    if (orderIds.length > 0) {
      // Get sum
      const revenueResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        }
      });
      totalRevenue = revenueResult._sum.amount ?? 0;
      const payments = await prisma.payment.findMany({
        where: {
          orderId: { in: orderIds },
          status: PaymentStatus.PAID
        },
        select: { amount: true, createdAt: true },
      });

      // Prepare chart data
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenue: Record<number, number> = {};
      payments.forEach(payment => {
        const month = payment.createdAt.getMonth();
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(payment.amount);
      });

      barChartData = monthNames.map((month, idx) => ({
        month,
        revenue: monthlyRevenue[idx] ?? 0,
      }));
    } else {
      // No orders, empty chart
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      barChartData = monthNames.map(month => ({ month, revenue: 0 }));
    }

    return {
      counts: {
        mealsCount: mealsCount,
        orderCount,
      },
      totalRevenue,
      monthlyRevenue: barChartData,
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      order: {
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder,
      }
    };
  } catch (error) {
    console.error("Failed to fetch provider dashboard stats:", error);
    throw new Error("Could not fetch provider dashboard stats");
  }
};


export const getPublicStatsData = async () => {
  try {
    // Total Events
    const totalmeals = await prisma.meal.count();

    // Total Users
    const totalUsers = await prisma.user.count();
    const totalCustomer= await prisma.user.count({
      where: { role: "Customer" },
    });

    // Total Managers (role: Provider)
    const totalprovider = await prisma.user.count({
      where: { role: "Provider" },
    });

    // Total Admins (role: ADMIN)
    const totalAdmins = await prisma.user.count({
      where: { role: "Admin" },
    });

    // Total orders (number of unique orders)
    const totalorders = await prisma.order.count();
    const totalcategory = await prisma.category.count();

    // Total Reviews
    const totalReviews = (await prisma.review?.count?.({where:{status:"APPROVED",parentId:null}})) ?? 0;

    // Total Newsletters
    const totalNewsletters = (await prisma.newsletter?.count?.()) ?? 0;

    return {
      totalmeals,
      totalUsers,
      totalCustomer,
      totalprovider,
      totalAdmins,
      totalorders,
      totalcategory,
      totalReviews,
      totalNewsletters,
    };
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    throw new Error("Could not fetch public stats");
  }
};

export const statsService = { getDashboardStatsData ,getPublicStatsData};