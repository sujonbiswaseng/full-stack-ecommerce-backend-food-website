import { seedAdmin } from './../../scripts/seedAdmin';
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";

import { createHighlightSchema, updateHighlightSchema } from "./highlight.validation";
import { HighlightController } from "./highlight.controller";
import { multerUpload } from "../../config/multer.config";
import { UserRoles } from '../../middleware/auth.const';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  "/highlight",
  auth([UserRoles.Admin]),
  multerUpload.single("file"),
  validateRequest(createHighlightSchema),
  HighlightController.createHighlight
);

router.get(
  "/highlights",
  HighlightController.getAllHighlights
);

router.get(
  "/highlight/:id",
  HighlightController.getSingleHighlight
);

router.put(
  "/highlight/:id",
  auth([UserRoles.Admin]),
  validateRequest(updateHighlightSchema),
  HighlightController.updateHighlight
);

router.delete(
  "/highlight/:id",
  auth([UserRoles.Admin]),
  HighlightController.deleteHighlight
);

export const HighlightRouters = router;
