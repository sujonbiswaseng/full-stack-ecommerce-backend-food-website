import { NextFunction, Request, Response } from "express";
import { mealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationHelping";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
const createMeal = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "you are unauthorized" });
  }
  const files = req.files as Express.Multer.File[];

  const payload = {
    ...req.body,
    images: files?.length ? files.map((file) => file.path) : req.body.images,
  };
  const result = await mealService.createMeal(payload, user.email as string);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "your meal has been created",
    data: result,
  });
});

const UpdateMeals = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ success: false, message: "you are not authorized" });
  }
  const payload = {
    ...req.body,
    image: req.file?.path || req.body.image || null
  };
  const result = await mealService.UpdateMeals(
    payload,
    req.params.id as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "meal update successfully",
    data: result,
  });
});

const DeleteMeals = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(status.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized",
    });
  }
  const result = await mealService.DeleteMeals(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "your meal delete has been successfully",
    data: result,
  });
});

const Getallmeals = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;

  const isAvailable = req.query.isAvailable
    ? req.query.isAvailable === "true"
      ? true
      : req.query.isAvailable == "false"
        ? false
        : undefined
    : undefined;

  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );

  const result = await mealService.getAllmeals(
    req.query as any,
    isAvailable as boolean,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result,
  });
});

const getAllMealsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const { search } = req.query;

    const isAvailable = req.query.isAvailable
      ? req.query.isAvailable === "true"
        ? true
        : req.query.isAvailable == "false"
          ? false
          : undefined
      : undefined;
    const result = await mealService.getAllMealsForAdmin(
      req.query as any,
      isAvailable as boolean,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      search as string,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: " retrieve all meals for admin successfully",
      data: result,
    });
  },
);

const GetSignlemeals = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result,
  });
});

const getownmeals = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ success: false, message: "you are unauthorized" });
  }

  const { search } = req.query;
  const isAvailable = req.query.isAvailable
    ? req.query.isAvailable === "true"
      ? true
      : req.query.isAvailable == "false"
        ? false
        : undefined
    : undefined;

  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
    req.query,
  );
  const result = await mealService.getOwnMeals(
    user.email,
    req.query as any,
    isAvailable as boolean,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result,
  });
});
const DeviceryCharge = catchAsync(async (req: Request, res: Response) => {
  const { providerId } = req.query;

  if (!providerId) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "providerId is required",
    });
  }
  const meal = await mealService.getMealByProvider();

  if (!meal) {
    return res.status(status.NOT_FOUND).json({
      success: false,
      message: "No meal found for this provider",
    });
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Delivery charge retrieved successfully",
    data: { deliveryCharge: meal.deliverycharge },
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {

  const user = req.user;
  if (!user) {
    return res
      .status(status.UNAUTHORIZED)
      .json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "meal status update successfully",
    data: result,
  });
});
export const mealController = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  Getallmeals,
  GetSignlemeals,
  getownmeals,
  updateStatus,
  getAllMealsForAdmin,
  DeviceryCharge,
};
