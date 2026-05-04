import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IRequestUser } from "../../interface/requestUser.interface";
import { ICreateHighlightInput, IUpdateHighlightInput } from "./highlight.interface";

// Create a new highlight
const createHighlight = async (user: IRequestUser, payload: ICreateHighlightInput) => {
  const { title, description, image } = payload;

  if (!title || !description) {
    throw new AppError(status.BAD_REQUEST, "Title and description are required to create a highlight.");
  }

  const highlight = await prisma.highlight.create({
    data: {
      title,
      description,
      image: image ?? null,
      userId: user.userId,
    },
  });

  return highlight;
};

// Get all highlights (with optional search and pagination)
const getAllHighlights = async (
  query?: Record<string, any>,
  page?: number,
  limit?: number,
  skip?: number,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  search?: string,
) => {
  const where: any = {};
  if (query?.title) {
    where.title = { contains: query.title, mode: "insensitive" };
  }
  if (query?.description) {
    where.description = { contains: query.description, mode: "insensitive" };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  const highlights = await prisma.highlight.findMany({
    where,
    skip: skip || ((page && limit) ? (page - 1) * limit : undefined),
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
  const total = await prisma.highlight.count({ where });
  return {
    data: highlights,
    pagination: {
      total,
      page: page || 1,
      limit: limit || highlights.length,
      totalpage: limit ? Math.ceil(total / limit) : 1,
    },
  };
};

// Get a single highlight by ID
const getSingleHighlight = async (highlightId: string) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
  if (!highlight) {
    throw new AppError(status.NOT_FOUND, "Highlight not found");
  }
  return highlight;
};

// Update highlight
const updateHighlight = async (highlightId: string, payload: IUpdateHighlightInput, user: IRequestUser) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
  });
  if (!highlight) {
    throw new AppError(status.NOT_FOUND, "Highlight not found");
  }
  if (user.role !== "ADMIN" && highlight.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to update this highlight");
  }
  const updatedHighlight = await prisma.highlight.update({
    where: { id: highlightId },
    data: payload,
  });
  return updatedHighlight;
};

// Delete highlight
const deleteHighlight = async (user: IRequestUser, highlightId: string) => {
  const highlight = await prisma.highlight.findUnique({
    where: { id: highlightId },
  });
  if (!highlight) {
    throw new AppError(status.NOT_FOUND, "Highlight not found");
  }
  if (user.role !== "ADMIN" && highlight.userId !== user.userId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to delete this highlight");
  }
  const deletedHighlight = await prisma.highlight.delete({
    where: { id: highlightId },
  });
  return deletedHighlight;
};

export const HighlightServices = {
  createHighlight,
  getAllHighlights,
  getSingleHighlight,
  updateHighlight,
  deleteHighlight,
};
