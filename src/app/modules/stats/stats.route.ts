import express from "express";
import { StatsController } from "./stats.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";


const router = express.Router();

router.get(
  "/stats",
  auth([UserRoles.Admin, UserRoles.Provider]),
  StatsController.getDashboardStatsData
);

export const StatsRoutes = router;