import { Request, Response } from "express"
import { catchAsync } from "../../shared/catchAsync"
import { prisma } from "../../lib/prisma";
import { sendResponse } from "../../shared/sendResponse";
import { RAGService } from "./rag.service";
import status from "http-status";
import { redisService } from "../../lib/redis";
const ragService=new RAGService()
const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ragService.getStats();

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "RAG stats retrieved successfully",
    data: result,
  });
});


const Ingestevents=catchAsync(async(req:Request,res:Response)=>{
   const result =await ragService.ingestEventData()
   console.log(result,'reselt')
   sendResponse(res,{
    success:true,
    message:"ingest event successfully",
   httpStatusCode:200,
   data:result
   })
})

const queryRag = catchAsync(async (req: Request, res: Response) => {
  const { query, limit, sourceType } = req.body;

  if (!query) {
    return sendResponse(res, {
      success: false,
      httpStatusCode: status.BAD_REQUEST,
      message: "Query is required",
    });
  }
  // generate cache key from query params
  const cacheKey=`rag:query:${query}:${limit??5}:${sourceType||"all"}`

  console.log(cacheKey,'es')
  try {
    const cacheResult = await redisService.get(cacheKey)
    if(cacheResult){
      // cache-hit
      const parseData=JSON.parse(cacheResult);
     return sendResponse(res,{
        success:true,
        httpStatusCode:status.OK,
        message:"Answer retrieved from cache",
        data:parseData
      })
    }
  } catch (error) {
    console.warn("Cache read error , proceeding with normal processing ",error)
  }

  // cache-miss

  const result = await ragService.generateAnswer(
    query,
    limit ?? 5,
    sourceType,
    true,
  );

  try {
    // store cache with 10 min(600 secound)
   const dat= await redisService.set(cacheKey,result,600);
   console.log(dat,'da')
  } catch (error) {
    console.log("cache Write error",error)
  }

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Answer generated successfully",
    data: result,
  });
});
export const RagController={getStats,Ingestevents,queryRag}