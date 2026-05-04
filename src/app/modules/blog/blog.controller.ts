import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationHelping";
import { BlogServices } from "./blog.service";
import AppError from "../../errorHelper/AppError";

// Create a new blog post
const createBlog = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }
  const files = req.files as Express.Multer.File[];

  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images,
  };

  const user = req.user;
  const result = await BlogServices.createBlog(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

// Get all blog posts (with pagination and sorting)
const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
  const {search}=req.query;
  const result = await BlogServices.getAllBlogs(req.query,page, limit, skip, sortBy, sortOrder,search as any);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Blogs fetched successfully",
    data: result,
  });
});
const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.getSingleBlog(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Blog fetched successfully",
    data: result,
  });
});

// Update a blog post by ID
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.updateBlog(id as string, req.body,req.user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});

// Delete a blog post by ID
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServices.deleteBlog(req.user,id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
