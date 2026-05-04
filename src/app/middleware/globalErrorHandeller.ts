import status from "http-status";
import AppError from "../errorHelper/AppError";
import { TErrorSources } from "../interface/error.interface";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode: number = status.INTERNAL_SERVER_ERROR; // Default 500
    let message: string = 'Internal Server Error';
    let errorSources: TErrorSources[] = [];

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = status.BAD_REQUEST;
        message = "Validation Error";
        errorSources.push({ message: err.message });
    }
    // ... আপনার বাকি Prisma Check গুলো ঠিক আছে ...
    
    // Timeout (DB or network)
    else if (err?.code === 'ETIMEDOUT' || err?.code === 'PROTOCOL_TIMEOUT') {
        statusCode = status.GATEWAY_TIMEOUT;
        message = 'Database request timed out. Please retry after a short while.';
        errorSources.push({ message });
    }
    
    // AppError handling (এখানেই সমস্যা ছিল)
    else if (err instanceof AppError) {
        // statusCode অবশ্যই err.statusCode হতে হবে, ৫০০০ নয়!
        statusCode = err.statusCode || status.BAD_REQUEST;
        message = err.message;
        errorSources.push({ message: err.message });
    }

    // রেসপন্স পাঠানোর ফরম্যাট
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // ডেভেলপমেন্ট মোডে থাকলে স্ট্যাক ট্রেস দেখতে পারেন
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}

export default errorHandler;