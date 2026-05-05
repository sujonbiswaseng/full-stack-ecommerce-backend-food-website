import z from "zod";

export const CreatemealData = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    location: z.string().min(3, "Location is required"),
    images:z.array(z.string()).default([]),
    date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val).toISOString()),
    price: z.number(),
    deliverycharge: z.number().optional(),
    isAvailable: z.boolean().optional(),
    dietaryPreference: z
      .enum([
        "HALAL",
        "VEGAN",
        "VEGETARIAN",
        "ANY",
        "GLUTEN_FREE",
        "KETO",
        "PALEO",
        "DAIRY_FREE",
        "NUT_FREE",
        "LOW_SUGAR",
      ])
      .default("VEGETARIAN"),
    category_name: z.string(),
    cuisine: z
      .enum([
        "BANGLEDESHI",
        "ITALIAN",
        "CHINESE",
        "INDIAN",
        "MEXICAN",
        "THAI",
        "JAPANESE",
        "FRENCH",
        "MEDITERRANEAN",
        "AMERICAN",
        "MIDDLE_EASTERN",
      ])
      .default("BANGLEDESHI"),
  })
  .strict();

// update
export const UpdatemealData = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.any().optional(),
  location: z.string().optional(),
  images: z.any().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
  category_name: z.string().optional(),
  cuisine: z
    .enum([
      "BANGLEDESHI",
      "ITALIAN",
      "CHINESE",
      "INDIAN",
      "MEXICAN",
      "THAI",
      "JAPANESE",
      "FRENCH",
      "MEDITERRANEAN",
      "AMERICAN",
      "MIDDLE_EASTERN",
    ])
    .optional(),
  dietaryPreference: z
    .enum([
      "HALAL",
      "VEGAN",
      "VEGETARIAN",
      "ANY",
      "GLUTEN_FREE",
      "KETO",
      "PALEO",
      "DAIRY_FREE",
      "NUT_FREE",
      "LOW_SUGAR",
    ])
    .optional(),
});

// 1. query params
export const mealQuerySchema = z.object({
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(), // Coerce handles strings from forms/URLs
    dietaryPreference: z.string().optional(),
    cuisine: z.string().optional(),
    category_name: z.string().optional(),
  }),
});

export const mealupdateStatus = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
