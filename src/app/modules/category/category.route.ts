import { Router } from "express";
import { UserRoles } from "../../middleware/auth.const";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { createcategoryData, UpdatecategoryData } from "./category.validation";
import { multerUpload } from "../../config/multer.config";

const router=Router()

router.post("/admin/category",auth([UserRoles.Admin]),multerUpload.single("file"),validateRequest(createcategoryData),CategoryController.CreateCategory)
router.get("/category",CategoryController.getCategory)
router.get("/category/:id",CategoryController.SingleCategory)
router.put("/admin/category/:id",auth([UserRoles.Admin]),multerUpload.single("file"),validateRequest(UpdatecategoryData),CategoryController.UpdateCategory)
router.delete("/admin/category/:id",auth([UserRoles.Admin]),CategoryController.DeleteCategory)

export const CategoryRouter={router}