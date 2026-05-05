import z from "zod";
import { CreatemealData, mealQuerySchema, UpdatemealData } from "./meal.validation";
// create meals
export type ICreateMealsData=z.infer<typeof CreatemealData>

// update meals
export type IUpdateMealsData = z.infer<typeof UpdatemealData>;

// 2. Infer the TypeScript Type
export type IMealQueryRequest = z.infer<typeof mealQuerySchema>;

export interface MealQuery  {
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    dietaryPreference?: string | undefined;
    cuisine?: string | undefined;
    category_name?: string | undefined;
};