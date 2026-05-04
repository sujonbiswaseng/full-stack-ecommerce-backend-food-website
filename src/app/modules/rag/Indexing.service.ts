import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }
  async indexDocument(
    chunkKey: string,
    sourceType: string,
    sourceId: string,
    content: string,
    sourceLabel?: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      const embedding =
        await this.embeddingService.generateEmbedding(content);

      const vectorLiteral = toVectorLiteral(embedding);

      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO "document_embeddings"
        (
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES
        (
          ${Prisma.raw("gen_random_uuid()")},
          ${chunkKey},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})}::jsonb,
          CAST(${vectorLiteral} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "sourceType" = EXCLUDED."sourceType",
          "sourceId" = EXCLUDED."sourceId",
          "sourceLabel" = EXCLUDED."sourceLabel",
          "content" = EXCLUDED."content",
          "metadata" = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW()
      `);
    } catch (error) {
      console.error("❌ Index document error:", error);
      throw error;
    }
  }


  async indexMealsData() {
    try {
      console.log("Fetching meals for indexing...");

      const meals = await prisma.meal.findMany({
        include: {
          blogs: true,
          orderitem: {
            include: {
              order: true,
            },
          },
          category: true,
          provider: {
            include: { user: true },
          },
          reviews: {
            where: {
              parentId: null,
              rating: { gt: 0 },
              status: "APPROVED",
            },
            include: {
              customer: true,
            },
          },
        },
      });

      let indexedCount = 0;

      for (const meal of meals) {


        const orders = meal.orderitem.map((oi) => oi.order);

        const totalOrders = orders.length;

        const totalRevenue = orders.reduce((sum, order) => {
          return sum + (order.totalPrice || 0);
        }, 0);

        const totalReviews = meal.reviews.length;

        const avgRating =
          totalReviews > 0
            ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) /
              totalReviews
            : 0;

        const reviewsText = meal.reviews
          .map(
            (r) => `
Rating: ${r.rating}/5
Comment: ${r.comment || "No comment"}
Customer: ${r.customer?.name || "Anonymous"}
`
          )
          .join("\n");

        const blogsText = meal.blogs
          .map(
            (b) => `
Title: ${b.title}
Content: ${b.content}
Published: ${b.createdAt}
`
          )
          .join("\n");

        const content = `

ID: ${meal.id}
Title: ${meal.title}
Description: ${meal.description || "No description"}

Category: ${meal.category_name}
Cuisine: ${meal.cuisine}
Dietary: ${meal.dietaryPreference}

Location: ${meal.location}
Date: ${meal.date}

Price: ${meal.price} BDT
Delivery Charge: ${meal.deliverycharge} BDT
Availability: ${meal.isAvailable ? "Available" : "Not Available"}
Status: ${meal.status}

Name: ${meal.provider?.user?.name || "Unknown"}
Email: ${meal.provider?.user?.email || "Unknown"}


Total Orders: ${totalOrders}
Total Revenue: ${totalRevenue} BDT

Total Reviews: ${totalReviews}
Average Rating: ${avgRating.toFixed(2)} / 5

Performance Level:
${
  totalRevenue > 10000
    ? "High Earning Meal"
    : totalRevenue > 5000
    ? "Moderate Performance"
    : "Low Performance"
}

===== REVIEWS =====
${reviewsText || "No reviews"}

===== BLOGS =====
${blogsText || "No blogs"}
`;

        const metadata = {
          mealId: meal.id,
          title: meal.title,
          category: meal.category_name,
          cuisine: meal.cuisine,
          location: meal.location,
          price: meal.price,
          isAvailable: meal.isAvailable,

          totalOrders,
          totalRevenue,

          totalReviews,
          avgRating,

          providerId: meal.providerId,
          providerRole: meal.provider?.user?.role || "USER",

          createdAt: meal.createdAt,
        };

        const chunkKey = `meal-${meal.id}`;

        await this.indexDocument(
          chunkKey,
          "MEAL",
          meal.id,
          content,
          meal.title,
          metadata
        );

        indexedCount++;
      }

      console.log(`Indexed ${indexedCount} meals successfully`);

      return {
        success: true,
        indexedCount,
      };
    } catch (error) {
      console.error(" Indexing failed:", error);
      throw error;
    }
  }
}