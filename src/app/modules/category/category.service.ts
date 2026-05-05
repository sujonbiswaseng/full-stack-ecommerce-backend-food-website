import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";
import { UpdatecategoryData } from "./category.validation";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { parseDateForPrisma } from "../../utils/parseDate";
import { CategoryWhereInput } from "../../../generated/prisma/models";
const CreateCategory = async (data: ICreateCategory, email: string) => {
  if(!data.image){
    throw new AppError(404, "Image is required");
  }
  const adminUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!adminUser) {
    throw new AppError(status.UNAUTHORIZED, "Admin user not found or unauthorized");
  }

  const adminId = adminUser.id;
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (categorydata) {
    throw new AppError(409, "Category already exists");
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: adminId },
  });


  const result = await prisma.category.create({
    data: {
      ...data,
      adminId: adminId,
    },
  });

  return result;
};

const getCategory = async ( 
  data?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  ) => {

    const andConditions: CategoryWhereInput[] = [];

    if (data?.name) {
      andConditions.push({
        name: data.name
      });
    }


    if (data?.createdAt) {
      const dateRange = parseDateForPrisma(data.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }
    if (data?.adminId) {
      andConditions.push({
        adminId: {
          contains: data.adminId,
          mode: "insensitive",
        },
      });
    }

    if (data?.id) {
      andConditions.push({
        id: {
          contains: data.id,
          mode: "insensitive",
        },
      });
    }
  const result = await prisma.category.findMany({
    where:{
      AND:andConditions
    },
    include: {
      meals: {
        where: {
          status: "APPROVED",
        },
      },
      user: true,
    },
    orderBy: { name: "desc" },
  });

  const total=await prisma.category.count({where:{
    AND:andConditions
  }})
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit!) || 1,
    },
}};

const SingleCategory = async (id: string) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      meals: {
        include: {
          reviews: true,
          provider:{include:{user:true}}
        },
      },
      user: true,
    },
  });
  if (result && Array.isArray(result.meals)) {
    result.meals = result.meals.map(meal => {
      let totalRating = 0;
      let totalReviews = 0;

      if (Array.isArray(meal.reviews)) {
  
        meal.reviews = meal.reviews.filter(
          review =>
            (review.status === "APPROVED" && review.parentId === null) ||
            typeof review.status === "undefined"
        );
        meal.reviews.forEach(review => {
          if (
            (review.status === "APPROVED" || typeof review.status === "undefined") &&
            typeof review.rating === "number"
          ) {
            totalRating += review.rating;
            totalReviews++;
          }
        });
      }

      const avgRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

      return {
        ...meal,
        avgRating,
        totalReviews,
      };
    });
  }
  return result;
};

const UpdateCategory = async (id: string, data: IUpdateCategory) => {
 
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id },
  });
  if (existcategory.name == name) {
    throw new AppError(409,"Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: {
      ...data
    },
  });
  return result;
};

const DeleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory,
};
