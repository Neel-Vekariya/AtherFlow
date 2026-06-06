import logger from "../utils/logger.js";


export default function ErrorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const IsOperational = err.IsOperational || false;
    
    if(!IsOperational) {
        logger.error(`Unexpected error: ${err.message}`, { err, correlationId:req?.correlationId});
    }

    if (!res || typeof res.status !== "function") {
        throw err; 
    }

    res.status(statusCode).json({
        error: IsOperational ? err.message : "An unexpected error occurred. Please try again later.",
        correlationId: req.correlationId
    });
}