import { Router } from "express";
import { RagController } from "./rag.controller";

const router=Router()
router.get("/stats",RagController.getStats)
router.post("/ingest-meals",RagController.IngestMeals)

// query rag
router.post("/query", RagController.queryRag);
export const Ragrouter=router