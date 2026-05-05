import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface/requestUser.interface";
import { ICreateBlogInput, IUpdateBlogInput } from "./blog.interface";
import { truncateSync } from "fs";
import { BlogWhereInput } from "../../../generated/prisma/models";
import { parseDateForPrisma } from "../../utils/parseDate";
const createBlog = async (user:IRequestUser, payload: ICreateBlogInput) => {
  const { title, content, images,mealid } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new AppError(status.BAD_REQUEST, "At least one image is required to create a blog.");
  }
    if (!mealid) {
      throw new AppError(status.BAD_REQUEST, "mealid ID is required to create a blog.");
    }
    const meal = await prisma.meal.findUnique({
      where: { id: mealid },
    });
    if (!meal) {
      throw new AppError(status.BAD_REQUEST, "The provided mealid does not correspond to any existing mealid.");
    }
  
  if (!title || !content || !images) {
    throw new AppError(status.BAD_REQUEST, "Title, content, and image are required to create a blog.");
  }
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      images,
      authorId: existingUser.id,
      mealid:meal.id
    },
  });
  return blog;
};

const getAllBlogs = async (
  query?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:any
) => {

  const andConditions: BlogWhereInput[]  = [];

  if (query) {
    const orConditions: any[] = [];
    if (query.title) {
      orConditions.push({
        title: {
          contains: query.title,
          mode: "insensitive",
        },
      });
    }

    if (query.createdAt) {
      const dateRange = parseDateForPrisma(query.createdAt);
      andConditions.push({ createdAt: dateRange.gte });
    }

    if (search) {
      const orConditions: any[] = [];
      orConditions.push(
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        }
      );
      andConditions.push({OR:orConditions})
    }
  }

  console.log(andConditions,'sdfasf')
  const blogs = await prisma.blog.findMany({
    where:{AND:andConditions},
    skip: skip || ((page && limit) ? (page - 1) * limit : undefined),
    take: limit,
    orderBy: { [sortBy!]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      meal:true
    },
  });
  const total = await prisma.blog.count({ where :{AND:andConditions}});
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: 9,
      totalpage: limit ? Math.ceil(total / limit) : 1,
    },
  };
};

const getSingleBlog = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
      meal:true,

    },
  });
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }
  return blog;
};

const updateBlog = async (blogId: string, payload: IUpdateBlogInput, user: IRequestUser) => {
  // Check user by email
  const userFromDb = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!userFromDb) {
    throw new AppError(404, "User not found");
  }
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }
  if (userFromDb.role !== "Admin" && blog.authorId !== user.id) {
    throw new AppError(403, "You are not authorized to update this blog");
  }
  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data:{
      content:payload.content,
      images:payload.images,
      title:payload.title
    },
  });
  return updatedBlog;
};

const deleteBlog = async (user: IRequestUser, blogId: string) => {
  const userFromDb = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!userFromDb) {
    throw new AppError(404, "User not found");
  }
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });
  if (!blog) {
    throw new AppError(404, "Blog not found");
  }
  if (userFromDb.role !== "Admin" && blog.authorId !== userFromDb.id) {
    throw new AppError(403, "You are not authorized to delete this blog");
  }
  const deletedBlog = await prisma.blog.delete({
    where: { id: blogId },
  });
  return deletedBlog;
};

// Extra: Get blogs by authorId
const getBlogsByAuthor = async (
  authorId: string,
  page?: number,
  limit?: number,
  skip?: number,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const where = { authorId };
  const blogs = await prisma.blog.findMany({
    where,
    skip: skip || ((page && limit) ? (page - 1) * limit : undefined),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      author: { select: { id: true, name: true, email: true, image: true } },
    },
  });
  const total = await prisma.blog.count({ where });
  return {
    data: blogs,
    pagination: {
      total,
      page: page || 1,
      limit: limit || blogs.length,
      totalpage: limit ? Math.ceil(total / limit) : 1,
    },
  };
};

export const BlogServices = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor,
};
