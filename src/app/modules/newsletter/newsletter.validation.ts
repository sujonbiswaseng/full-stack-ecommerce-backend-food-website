import { z } from "zod";

export const createNewsletterSchema = z.object({
  email: z.string(),
});

export const updateNewsletterSchema = z.object({
  email: z.string().optional(),
});