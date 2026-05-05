import { Router } from "express";
import { mealRouter } from "../modules/meal/meal.route";
import { providerRouter } from "../modules/provider/provider.route";
import { OrderRouter } from "../modules/order/order.route";
import { CategoryRouter } from "../modules/category/category.route";
import { UserRouter } from "../modules/user/user.route";
import { ReviewsRouter } from "../modules/reviews/reviews.route";
import { authRouter } from "../modules/auth/auth.route";
import { StatsRoutes } from "../modules/stats/stats.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { Ragrouter } from "../modules/rag/rag.route";
import { BlogRouters } from "../modules/blog/blog.route";
import { HighlightRouters } from "../modules/highlight/highlight.route";
import { NewsletterRouters } from "../modules/newsletter/newsletter.route";

const router = Router()

// meal
router.use("/v1",mealRouter.router)
router.use('/v1/rag',Ragrouter)

router.use('/v1/newsletter',NewsletterRouters);
router.use('/v1',BlogRouters);
router.use('/v1', HighlightRouters);



// provider
router.use("/v1",providerRouter.router)
// order
router.use("/v1",OrderRouter.router)

// category
router.use("/v1",CategoryRouter.router)


// users
router.use("/v1",UserRouter.router)
//reviews
router.use('/v1',ReviewsRouter.router)

//stats
router.use('/v1',StatsRoutes)
//payments
router.use('/v1',PaymentRouter)


// auth
router.use("/v1/auth",authRouter.router)

export const IndexRouter=router