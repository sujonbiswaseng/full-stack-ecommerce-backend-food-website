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
    metadata?: Record<string, unknown>,
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
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
          ${JSON.stringify(metadata || {})} :: jsonb,
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
      console.log(error);
      throw error;
    }
  }

  async indexEventsData() {
    try {
      console.log("Fetching events data for indexing...");

      const events = await prisma.event.findMany({
        include: {
          reviews: true,
          blogs: true,
          participants: true,
          payments:true,
          category:true,
          invitations: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      let indexedCount = 0;

      for (const event of events) {
        const blogsText = event.blogs
          .map(
            (blog) => `
            
  Blog Title:
  ${blog.title}
  
  Blog Content:
  ${blog.content}
  
  Published At:
  ${blog.createdAt}
  `,
          )
          .join("\n");
        const reviewsText = event.reviews
          .map(
            (review) => `
  Rating:
  ${review.rating}/5
  
  Comment:
  ${review.comment || "No comment"}
  `,
          )
          .join("\n");
        const participantsText = `
  Total Participants:
  ${event.participants.length}
  `;

        const invitationsText = `
  Total Invitations:
  ${event.invitations.length}
  `;
        const content = `
        owner name : sujon biswas
        id:${event.id}
        
  Event Title:
  ${event.title}
  
  Description:
  ${event.description}
  
  Category:
  ${event.category_name}
  
  Location:
  ${event.location}
  
  Event Date:
  ${event.date}
  
  Event Time:
  ${event.time}
  
  Visibility:
  ${event.visibility}
  
  Price Type:
  ${event.priceType}
  
  Ticket Fee:
  $${event.fee}
  
  Status:
  ${event.status}
  
  Featured Event:
  ${event.is_featured ? "Yes" : "No"}
  
  Organizer Information:
  Organizer Name: ${event.organizer?.name || "Unknown"}
  Organizer Email: ${event.organizer?.email || "Unknown"}
  Organizer Role: ${event.organizer?.role || "USER"}
  
  ${participantsText}
  
  ${invitationsText}
  
  Event Reviews:
  ${reviewsText || "No reviews yet."}
  
  Related Blogs:
  ${blogsText || "No blogs available."}
  `;
        const metadata = {
          eventId: event.id,
          title: event.title,
          category: event.category_name,
          location: event.location,
          visibility: event.visibility,
          priceType: event.priceType,
          fee: event.fee,
          status: event.status,
          featured: event.is_featured,
          totalReviews: event.reviews.length,
          totalBlogs: event.blogs.length,
          totalParticipants: event.participants.length,
          totalInvitations: event.invitations.length,
          organizerRole: event.organizer?.role,
        };
        const chunkKey = `event-${event.id}`;
        await this.indexDocument(
          chunkKey,
          "EVENT",
          event.id,
          content,
          event.title,
          metadata,
        );

        indexedCount++;
      }

      console.log(`Successfully indexed ${indexedCount} events.`);

      return {
        success: true,
        message: `Successfully indexed ${indexedCount} events.`,
        indexedCount,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
