
import {
  ICreateMealsData,
  IMealQueryRequest,
  IUpdateMealsData,
  MealQuery,
} from "./meal.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { parseDateForPrisma } from '../../utils/parseDate';
import { prisma } from "../../lib/prisma";
import { MealWhereInput } from "../../../generated/prisma/models";
import { DietaryPreference } from "../../../generated/prisma/enums";

const createMeal = async (data: ICreateMealsData, email: string) => {
  if(!data.images){
    throw new AppError(404, "Image is required");
  }
  const providerid = await prisma.user.findUnique({
    where: { email},
    include: { provider: { select: { id: true } } },
  });
  if (!providerid) {
    throw new AppError(status.NOT_FOUND, "provider not found");
  }

  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name,
    },
  });
  if (!categoryCheck) {
    throw new AppError(status.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid!.provider!.id,
      deliverycharge: data.deliverycharge !== undefined ? data.deliverycharge : 0,
    },
  });

  return result;
};

const getAllmeals = async (
  data: Record<string, any>,
  isAvailable?: boolean,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
) => {
  const andConditions: MealWhereInput[] | MealWhereInput = [];
  if (data) {
    const orConditions: any[] = [];

    if (search) {
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine,
        },
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive",
        },
      });
    }

  if (data?.date) {
    const dateRange = parseDateForPrisma(data.date);
    andConditions.push({ date: dateRange.gte });
  }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable: isAvailable });
  }

  if (data.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price),
      },
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ",",
    ) as DietaryPreference[];
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item })),
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED",
    },
    include: {
      provider: {
        include:{user:true}
      },
      reviews: {
        
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED",
        },
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      [sortBy!]: sortOrder,
    },
  });

  const mealsWithStats = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const avgRating =
      totalReviews > 0
        ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return { ...meal, avgRating, totalReviews };
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });

  return {
    data: mealsWithStats,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit!) || 1,
    },
  };
};

const getMealByProvider = async () => {
  const meal = await prisma.meal.findFirst({
    where: {
      status: "APPROVED",
    },
    select: {
      deliverycharge: true,
    },
  });

  return meal;
};


const getSinglemeals = async (id: string) => {
  // Get the meal & reviews
  const result = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
      status: "APPROVED",
    },
    include: {
      category: true,
      provider: {
        include: {
          user: true,
          meals: {
            include: {
              reviews: {
                where: {
                  parentId: null,
                  status: "APPROVED",
                  rating: { gt: 0 },
                },
              },
            },
          },
        },
      },
      reviews: {
        where: {
          parentId: null,
          status: "APPROVED",
          rating: { gt: 0 },
        },
        include: {
          replies: {
            include: {
              customer: true,
              replies: true,
            },
          },
          customer: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  // Calculate single meal statistics
  const mealTotalReviews = result.reviews.length;
  const mealAvgRating =
    mealTotalReviews > 0
      ? Number(
          (
            result.reviews.reduce((sum, review) => sum + review.rating, 0) /
            mealTotalReviews
          ).toFixed(1)
        )
      : 0;

  // Calculate provider statistics over all approved meals and reviews
  const providerMeals = result.provider?.meals ?? [];
  let providerTotalReviews = 0;
  let providerRatingSum = 0;
  providerMeals.forEach((meal) => {
    const ratingReviews = meal.reviews.filter(
      (review) => typeof review.rating === "number"
    );
    providerTotalReviews += ratingReviews.length;
    providerRatingSum += ratingReviews.reduce((sum, r) => sum + r.rating, 0);
  });
  const providerAvgRating =
    providerTotalReviews > 0
      ? Number((providerRatingSum / providerTotalReviews).toFixed(1))
      : 0;

      console.log(result,'result')
  return {
    ...result,
    avgRating: mealAvgRating,
    totalReviews: mealTotalReviews,
    providerRating: {
      averageRating: providerAvgRating,
      totalReview: providerTotalReviews,
    },
  };
};

const UpdateMeals = async (data: IUpdateMealsData, mealid: string) => {
  const { category_name } = data as any;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid },
  });
  if (!existmeal) {
    throw new AppError(status.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError(status.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid,
    },
    data: {
      title: data.title,
    description: data.description,
    ...(data.images !== null && typeof data.images !== "undefined" ? { image: data.images } : {}),
    price: data.price,
    isAvailable: data.isAvailable,
    category_name: data.category_name,
    cuisine: data.cuisine,
    dietaryPreference:data.dietaryPreference
    },
  });

  return result;
};

const DeleteMeals = async (mealid: string) => {
  const orderitem=await prisma.meal.findUnique({
    where:{
      id:mealid
    },
    select:{
      orderitem:true
    }
  })
 const result = await prisma.meal.delete({
    where: {
      id: mealid,
    },
  });
  return result;
};

const getOwnMeals = async (
  email?:string,
  data?: Record<string, any>,
  isAvailable?: boolean,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined) => {
  let userid;
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }
    userid = user.id;
  }



  const andConditions: MealWhereInput[] | MealWhereInput = [];
  if (data) {
    const orConditions: any[] = [];

    if (search) {
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      );
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine,
        },
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive",
        },
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable: isAvailable });
  }

  if (data?.price) {
    andConditions.push({
      price: {
        gte: 0,
        lte: Number(data.price),
      },
    });
  }
  if(data?.status){
    andConditions.push({
      status:{
        equals:data.status
      }
    })
  }
  if (data?.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ",",
    ) as DietaryPreference[];
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item })),
    });
  }


  const meals = await prisma.meal.findMany({
    take: limit,
      skip,
    where: {
      provider: {
        userId: userid,
      },
      AND:andConditions
    },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: {
          parentId: null,
        },
        include: {
          replies: {
            include: {
              replies: true,
            },
          },
        },
      },
    },
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewData = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
  const mealsData = meals.map((meal) => {
    const stats = reviewData.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      avgRating: stats?._avg?.rating || 0, // Default to 0
      totalReviews: stats?._count?.rating || 0, // Default to 0
    };
  });
  const total=await prisma.meal.count({where:{
    AND:andConditions,
    provider: {
      userId: userid,
    },
  }})

  
  return {mealsData,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / (limit || 1)) || 1,
    },
    
  };
};

const updateStatus = async (data: any, mealid: string) => {
  const { status } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid,
    },
  });
  if (existmeal?.status === status) {
    throw new AppError(409, "meal status already up to date");
  }
  if (existmeal?.id !== mealid) {
    throw new AppError(404, "mealid is invalid,please check your mealid");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid,
    },
    data: {
      status,
    },
  });
  return result;
};
const getAllMealsForAdmin=async(
  data: Record<string, any>,
  isAvailable?: boolean,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
)=>{
    const andConditions: MealWhereInput[] | MealWhereInput = [];
    if (data) {
      const orConditions: any[] = [];
  
      if (search) {
        orConditions.push(
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        );
      }
      if (data.cuisine) {
        orConditions.push({
          cuisine: {
            equals: data.cuisine,
          },
        });
      }

      if (data.status) {
        orConditions.push({
          status: {
            equals: data.status,
          },
        });
      }

      if (data.category_name) {
        orConditions.push({
          category_name: {
            contains: data.category_name,
            mode: "insensitive",
          },
        });
      }
      if (orConditions.length > 0) {
        andConditions.push({ OR: orConditions });
      }
    }
    if (typeof isAvailable === "boolean") {
      andConditions.push({ isAvailable: isAvailable });
    }
  
    if (data.price) {
      andConditions.push({
        price: {
          gte: 0,
          lte: Number(data.price),
        },
      });
    }
    if (data.dietaryPreference?.length) {
      const dietaryList = data.dietaryPreference.split(
        ",",
      ) as DietaryPreference[];
      andConditions.push({
        OR: dietaryList.map((item) => ({ dietaryPreference: item })),
      });
    }
    const meals = await prisma.meal.findMany({
      take: limit,
      skip,
      where: {
        AND: andConditions,
      },
      include: {
        provider: {
          include:{user:true}
        },
        reviews: {
          
          where: {
            parentId: null,
            rating: { gt: 0 },
            status: "APPROVED",
          },
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        [sortBy!]: sortOrder,
      },
    });
    const total = await prisma.meal.count({ where: { AND: andConditions } });
    return {
      data: meals,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / limit!) || 1,
      },
    };
}

export const mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus,
  getAllMealsForAdmin,
  getMealByProvider
};
