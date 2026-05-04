import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import paginationSortingHelper from "../../helpers/paginationHelping";
import { HighlightServices } from "./highlight.service";
import AppError from "../../errorHelper/AppError";

// Create a new highlight
const createHighlight = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access. Please login first.");
  }

  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image,
  };
  const user = req.user;
  const result = await HighlightServices.createHighlight(user, payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Highlight created successfully",
    data: result,
  });
});

// Get all highlights (with pagination and sorting)
const getAllHighlights = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
  const result = await HighlightServices.getAllHighlights({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    filters: req.query,
  });
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Highlights fetched successfully",
    data: result,
  });
});

// Get single highlight by ID
const getSingleHighlight = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HighlightServices.getSingleHighlight(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Highlight fetched successfully",
    data: result,
  });
});

// Update a highlight by ID
const updateHighlight = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const payload = {
    ...(req.body.title !== undefined && { title: req.body.title }),
    ...(req.body.description !== undefined && { description: req.body.description }),
    ...(req.body.image !== undefined && { image: req.body.image }),
  };

  const result = await HighlightServices.updateHighlight(id as string, payload, req.user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Highlight updated successfully",
    data: result,
  });
});

// Delete a highlight by ID
const deleteHighlight = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await HighlightServices.deleteHighlight(req.user, id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Highlight deleted successfully",
    data: result,
  });
});

export const HighlightController = {
  createHighlight,
  getAllHighlights,
  getSingleHighlight,
  updateHighlight,
  deleteHighlight,
};
