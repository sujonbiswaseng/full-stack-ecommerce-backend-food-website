import { z } from "zod";

export const createHighlightSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.string().url({ message: "Image must be a valid URL." }).optional().nullable(),
});

export const updateHighlightSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.any().optional()
  })