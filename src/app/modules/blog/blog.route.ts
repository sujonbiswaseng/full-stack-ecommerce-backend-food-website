import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createBlogSchema, updateBlogSchema } from "./blog.validation";
import { BlogController } from "./blog.controller";
import { multerUpload } from "../../config/multer.config";
import { UserRoles } from "../../middleware/auth.const";
import auth from "../../middleware/auth";

const router = Router();

// Routes for blog CRUD
router.post(
    "/blog",
    auth([UserRoles.Admin]), 
    multerUpload.array("files"),
    validateRequest(createBlogSchema),
    BlogController.createBlog
  )

router.get(
  "/blogs",
  BlogController.getAllBlogs
);

router.get(
  "/blog/:id",
  BlogController.getSingleBlog
);

router.put(
  "/blog/:id",
  auth([UserRoles.Admin]),
  validateRequest(updateBlogSchema),
  BlogController.updateBlog
);

router.delete(
  "/blog/:id",
  auth([UserRoles.Admin]),
  BlogController.deleteBlog
);

export const BlogRouters = router;
