import { seedAdmin } from '../../scripts/seedAdmin';
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/Auth";
import { createNewsletterSchema, updateNewsletterSchema } from "./newsletter.validation";

import { multerUpload } from "../../config/multer.config";
import { NewsletterController } from './newsletter.controller';

const router = Router();

// Routes for newsletter CRUD
router.post(
  "/newsletter",
  auth([Role.ADMIN, Role.USER,Role.MANAGER]),
  validateRequest(createNewsletterSchema),
  NewsletterController.createNewsletter
);

router.get(
  "/newsletters",auth([Role.ADMIN,Role.MANAGER]),
  NewsletterController.getAllNewsletters
);

router.get(
  "/newsletter/:id",
  NewsletterController.getSingleNewsletter
);

router.put(
  "/newsletter/:id",
  auth([Role.ADMIN, Role.MANAGER]),
  validateRequest(updateNewsletterSchema),
  NewsletterController.updateNewsletter
);

router.delete(
  "/newsletter/:id",
  auth([Role.ADMIN,Role.MANAGER]),
  NewsletterController.deleteNewsletter
);

export const NewsletterRouters = router;
