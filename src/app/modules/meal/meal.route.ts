import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { mealController } from "./meal.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { CreatemealData, mealupdateStatus, UpdatemealData } from "./meal.validation";
import { multerUpload } from "../../config/multer.config";

const router=Router()
router.get('/meals',mealController.Getallmeals)
router.get('/deviveryCharge',mealController.DeviceryCharge)
router.get('/admin/meals',auth([UserRoles.Admin]),mealController.getAllMealsForAdmin)
router.get('/provider/meals/own',auth([UserRoles.Provider]),mealController.getownmeals)
router.post(
  '/provider/meal',
  auth([UserRoles.Provider]),
  multerUpload.array("files"),
  validateRequest(CreatemealData),
  mealController.createMeal
)
router.delete('/provider/meal/:id',auth([UserRoles.Provider,UserRoles.Admin]),mealController.DeleteMeals)
router.put('/provider/meal/:id',auth([UserRoles.Provider]),multerUpload.single("file"),validateRequest(UpdatemealData),mealController.UpdateMeals)
router.get('/meal/:id',mealController.GetSignlemeals)
router.patch('/meal/:id',auth([UserRoles.Admin]),mealController.updateStatus)

export const mealRouter={router}