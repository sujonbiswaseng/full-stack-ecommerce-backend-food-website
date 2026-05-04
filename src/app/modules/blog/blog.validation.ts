import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  images:z.array(z.string()).default([]),
  eventId: z.string()
});

export const updateBlogSchema = z
  .object({
    title: z.string().min(1, { message: "Title cannot be empty." }).optional(),
    content: z.string().min(1, { message: "Content cannot be empty." }).optional(),
    images:z.array(z.string()).default([]),
    authorId: z.string().min(1, { message: "Author ID cannot be empty." }).optional(),
    eventId: z.string().optional().nullable(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided to update the blog." }
  );