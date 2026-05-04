import { v6 as uuidv6 } from "uuid";

import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { ICreateorderData } from "./order.interface";

import { parseDateForPrisma } from "../../utils/parseDate";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";
import { OrderWhereInput } from "../../../generated/prisma/models";
import { Order } from "../../../generated/prisma/client";
const CreateOrder = async (payload: ICreateorderData, email: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new AppError(404, "User not found");

  if (!payload.items?.length) {
    throw new AppError(400, "Order items are required");
  }

  const customerId = existingUser.id;

  const mealIds = payload.items.map((item) => item.mealId);
  const meals = await prisma.meal.findMany({
    where: { id: { in: mealIds } },
  });

  if (meals.length !== mealIds.length) {
    throw new AppError(404, "One or more meals were not found");
  }

  const mealById = new Map(meals.map((meal) => [meal.id, meal] as const));
  const providerIds = Array.from(new Set(meals.map((meal) => meal.providerId)));
  if (providerIds.length !== 1) {
    throw new AppError(
      400,
      "Single order supports meals from one provider only.",
    );
  }
  const providerId = providerIds[0];
  const deliverycharge = Number(meals[0]?.deliverycharge ?? 0);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findMany({
        where: {
          paymentStatus: "UNPAID",
        },
      });

      if (existingOrder) {
        await prisma.order.deleteMany({
          where: {
            id: {
              in: existingOrder.map((item) => item.id),
            },
          },
        });
      }

      const existingActiveOrder = await tx.order.findMany({
        where: {
          customerId,
          providerId,
          status: { in: ["PLACED", "PREPARING", "READY"] },
          paymentStatus: "PAID",
        },
        include: {
          orderitem: { include: { meal: true } },
        },
      });
      const existingMealIds = existingActiveOrder.flatMap((order) =>
        order.orderitem.map((item) => item.mealId),
      );

      const matchedMealIds = existingMealIds.filter((id) =>
        mealIds.includes(id),
      );

      if (matchedMealIds.length > 0) {
        throw new AppError(
          409,
          `Already ordered meals: ${matchedMealIds.join(", ")}`
        );
      }

      const totalMealPrice = payload.items.reduce((sum, item) => {
        const meal = mealById.get(item.mealId);
        return sum + Number(meal?.price ?? 0) * item.quantity;
      }, 0);

      const order = await tx.order.create({
        data: {
          customerId,
          providerId,
          address: payload.address,
          phone: payload.phone,
          paymentStatus: deliverycharge > 0 ? "UNPAID" : "PAID",
          totalPrice: totalMealPrice,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          orderitem: {
            createMany: {
              data: payload.items.map((item) => {
                const meal = mealById.get(item.mealId);
                return {
                  mealId: item.mealId,
                  price: Number(meal?.price ?? 0),
                  quantity: item.quantity,
                };
              }),
            },
          },
        },
      });

      if (deliverycharge === 0) {
        return {
          order,
          payment: null,
          paymentUrl: null,
          message: "Order created successfully (no delivery charge).",
        };
      }

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: deliverycharge,
          transactionId: String(uuidv6()),
          status: "UNPAID",
          userId: customerId,
          mealId: payload.items[0].mealId,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: { name: "Delivery charge" },
              unit_amount: 120 * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          orderId: order.id,
          paymentId: payment.id,
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            paymentId: payment.id,
          },
        },
        success_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`,
        cancel_url: `${envVars.FRONTEND_URL}/payment/${order.id}?paymentId=${payment.id}`,
      });

      return {
        order,
        payment,
        paymentUrl: session.url,
        message:
          "Order created successfully. Please complete payment from checkout URL.",
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Failed to create order. Please try again.");
  }
};


const getOwnmealsOrder = async (
  email?: string,
  data?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?: string | undefined,
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  });
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
      result: null,
    };
  }

  const andConditions: OrderWhereInput[] = [];

  if (search) {
    const orConditions: any[] = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive",
        },
      },
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }

  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status,
      },
    });
  }

  if (data?.phone) {
    andConditions.push({
      phone: data.phone,
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus,
      },
    });
  }

  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice),
      },
    });
  }

  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: existingUser.id,
        AND: andConditions,
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result,
    };
  }
  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      take: limit,
      skip,
      where: {
        providerId: existingUser.provider?.id,
        AND: andConditions,
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
    });

    let total = 0;
    if (existingUser?.role === "Provider") {
      total = await prisma.order.count({
        where: {
          providerId: existingUser.provider?.id,
          AND: andConditions,
        },
      });
    } else if (existingUser?.role === "Customer") {
      total = await prisma.order.count({
        where: {
          customerId: existingUser.id,
          AND: andConditions,
        },
      });
    }
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / (limit || 1)) || 1,
      },
    };
  }
};

const getOwnPaymentService = async (id: string, data:Record<string,any>,email:string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "User not found or unauthorized");
  }
  const orderres = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      payment: true
        },
  });
  if(orderres?.customerId!==user.id){
  throw new AppError(403, "You are not authorized to view this order payment");
  }
  if(orderres?.paymentStatus=="UNPAID"){
    throw new AppError(400,"your payment is not paid")
  }
  if(!orderres?.payment || orderres.payment.id!==data.paymentId){
    throw new AppError(404,'order payment not found')
  }
  if(!orderres){
    throw new AppError(400, "Order not found for the provided ID or payment info");
  }
  return orderres;
};

const UpdateOrderStatus = async (
  id: string,
  data: Partial<Order>,
  role: string,
) => {
  const { status } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!statusValue.includes(status as string)) {
    throw new AppError(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError(404, "no order found for this id");
  }

  if (existingOrder?.status == status) {
    throw new AppError(409, `order already ${status}`);
  }
  if (role == "Customer" && status !== "CANCELLED") {
    throw new AppError(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status == "CANCELLED") {
    if (
      existingOrder?.status == "DELIVERED" ||
      existingOrder?.status == "PREPARING" ||
      existingOrder?.status == "READY"
    ) {
      throw new AppError(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`,
      );
    }
    const result = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return result;
  }

  if (role == "Provider" && status === "CANCELLED") {
    throw new AppError(400, "CANCELLED only Customer Change");
  }

  if (role == "Provider") {
    if (
      status == "PLACED" ||
      status == "PREPARING" ||
      status == "READY" ||
      status == "DELIVERED"
    ) {
      const result = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      return {
        success: true,
        message: `update order status successfully`,
        result,
      };
    }
  }

  if (role === "Admin") {
    const result = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return {
      success: true,
      message: `update order status successfully`,
      result,
    };
  }
};

const getAllorder = async (
  role?: string,
  data?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?: string | undefined,
) => {
  if (role !== "Admin") {
    throw new AppError(403, "View all orders is only allowed for Admin users.");
  }

  const andConditions: OrderWhereInput[] = [];

  if (search) {
    const orConditions: any[] = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive",
        },
      },
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }

  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status,
      },
    });
  }

  if (data?.phone) {
    andConditions.push({
      phone: data.phone,
    });
  }
  if (data?.paymentStatus) {
    andConditions.push({
      paymentStatus: {
        equals: data.paymentStatus,
      },
    });
  }

  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.totalPrice),
      },
    });
  }

  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  const result = await prisma.order.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      orderitem: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const total = await prisma.order.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1,
    },
  };
};

const customerOrderStatusTrack = async (mealid: string, userid: string) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid,
        },
      },
    },
  });
  if (existingOrder.length === 0) {
    throw new AppError(status.NOT_FOUND, "no order found for this meal");
  }

  // const result = await prisma.order.findMany({
  //     include: {
  //         orderitem: {
  //             where: {
  //                 mealId: mealid
  //             },
  //             select: {
  //                 mealId: true,
  //                 price: true,
  //                 quantity: true
  //             },
  //             orderBy: {
  //                 createdAt: 'desc'
  //             }
  //         },

  //     },
  //     orderBy: {
  //         createdAt: 'desc'
  //     }
  // })
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder,
  };
};

const CustomerRunningAndOldOrder = async (userid: string, status: string) => {
  const andConditions: any[] = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status;
  if (status == "DELIVERED") {
    andConditions.push({ status: status });
    ((message = "Recent order information retrieved successfully."),
      (currentStatus = status));
  }
  if (status == "CANCELLED") {
    andConditions.push({ status: status });
    ((message = "CANCELLED order information retrieved successfully."),
      (currentStatus = status));
  }

  if (status == "PLACED" || status == "PREPARING" || status == "READY") {
    andConditions.push({ status: status });
    ((message = "running order retrieved successfully."),
      (currentStatus = status));
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions,
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } },
    },
  });

  return {
    success: true,
    message,
    result,
  };
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result,
  };
};

const deleteOrder = async (id: string, role: string) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }
  const deletedOrder = await prisma.order.delete({
    where: { id },
  });

  return {
    success: true,
    message: "Order deleted successfully",
    result: deletedOrder,
  };
};

export const ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder,
  getOwnPaymentService,
  deleteOrder,
};
