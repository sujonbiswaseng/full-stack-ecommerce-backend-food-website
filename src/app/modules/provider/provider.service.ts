
import { prisma } from "../../lib/prisma";

import { ICreateproviderData } from "./provider.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { ProviderProfileWhereInput } from "../../../generated/prisma/models";
import { ProviderProfile } from "../../../generated/prisma/client";


const createProvider = async (data: ICreateproviderData, userId: string) => {
  const existinguser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existinguser) {
    throw new AppError(404, "user not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: data.restaurantName,
      address: data.address,
      description: data.description,
      image: data.image,
      userId: userId,
    },
  });
  return result;
};

const getAllProvider = async ( 
  query?: Record<string, any>,
  isActive?:any,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
 ) => {
 


  const andConditions: ProviderProfileWhereInput[] = [];

  if (search || query) {
    const orConditions: any[] = [];
      orConditions.push({
        restaurantName: {
          contains: search,
          mode: "insensitive",
        },
      });

        orConditions.push({
          address: {
            contains: search,
            mode: "insensitive",
          },
        });

        orConditions.push({
          description: {
            contains: search,
            mode: "insensitive",
          },
        });

      if (orConditions.length > 0) {
        andConditions.push({ OR: orConditions });
      }
  }
  const providers = await prisma.providerProfile.findMany({
    where: {
      AND: andConditions,
      user:{
        name:{
          contains: search,
          mode: "insensitive",
        },
        isActive:isActive,
        email:query?.email
      }
    },
    take: limit,
    skip,
    include: {
      user: true,
      meals:{
        include:{
          reviews:true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  const result = providers.map((provider) => {
    const allReviews = provider.meals.flatMap((meal) => meal.reviews);
  
    const totalReviews = allReviews.length;
  
    const avgRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
  
    return {
      ...provider,
      totalReviews,
      avgRating,
    };
  });

  return result
};

const getProviderWithMeals = async (id: string) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id },
  });
  if (!existprovider) {
    throw new AppError(status.NOT_FOUND, "provider not found for this id");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews: true,
        },
      },
      meals: {
        include: { category: true ,reviews:true},
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!provider) {
    throw new AppError(status.NOT_FOUND, "provider not found for this id");
  }
  const userid = provider.userId;
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0,
      },
      parentId: null,
      meal: {
        provider: {
          userId: userid,
        },
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);

  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0,
  );

  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;

  return {
    result: {
      ...provider,
      totalReviews: totalReview || 0,
      avgRating: Number(averageRating.toFixed(1)) || 0,
    },
  };
};
const getTopProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      meals: {
        include: {
          reviews: {
            where:{
              parentId:null,
              status:"APPROVED"
            }
          },
        },
      },
    },
  });

  const topProviders = providers
    .map((provider) => {
      let totalRating = 0;
      let totalReviews = 0;
      provider.meals.forEach((meal) => {
        meal.reviews
          .filter((review) => review.parentId == null)
          .forEach((review) => {
            if (typeof review.rating === "number") {
              totalRating += review.rating;
              totalReviews++;
            }
          });
      });
 

      const avgRating =
        totalReviews > 0
          ? Number((totalRating / totalReviews).toFixed(1))
          : 0;

      return {
        id: provider.id,
        restaurantName: provider.restaurantName,
        ownerName: provider.user?.name || "N/A",
        email: provider.user?.email || "N/A",
        address: provider.address,
        description: provider.description,
        image: provider.image || provider.user?.image || null,
        totalReviews,
        avgRating,
      };
    })


    .sort((a, b) => {
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating;
      }
      return b.totalReviews - a.totalReviews;
    })
    .slice(0, 15);

  return { topProviders };
};



const UpateProviderProfile = async (
  data: Partial<ProviderProfile>,
  email: string,
) => {
  if (!data) {
    throw new AppError(status.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { email },
    include: {
      provider: true,
    },
  });
  if (!providerinfo) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider!.id },
    data: {
      restaurantName: data.restaurantName,
      image: data.image,
      description: data.description,
      address: data.address,
    },
  });

  return result;
};

export const providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile,
  getTopProviders
};
