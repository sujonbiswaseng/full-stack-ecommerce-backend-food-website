import { seedAdmin } from '../../scripts/seedAdmin';
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";

import { createNewsletterSchema, updateNewsletterSchema } from "./newsletter.validation";

import { multerUpload } from "../../config/multer.config";
import { NewsletterController } from './newsletter.controller';
import { UserRoles } from '../../middleware/auth.const';
import auth from '../../middleware/auth';

const router = Router();

// Routes for newsletter CRUD
router.post(
  "/newsletter",
  auth([UserRoles.Admin]),
  validateRequest(createNewsletterSchema),
  NewsletterController.createNewsletter
);

router.get(
  "/newsletters",auth([UserRoles.Admin]),
  NewsletterController.getAllNewsletters
);

router.get(
  "/newsletter/:id",
  NewsletterController.getSingleNewsletter
);

router.put(
  "/newsletter/:id",
  auth([UserRoles.Admin]),
  validateRequest(updateNewsletterSchema),
  NewsletterController.updateNewsletter
);

router.delete(
  "/newsletter/:id",
  auth([UserRoles.Admin]),
  NewsletterController.deleteNewsletter
);

export const NewsletterRouters = router;
