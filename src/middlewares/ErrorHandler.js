export class ApiError extends Error {
    constructor(statusCode,message,IsOperational=true) {
        super(message);
        this.statusCode = statusCode;
        this.IsOperational = IsOperational;
    }
}


export default function ErrorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const IsOperational = err.IsOperational || false;
    
    if(!IsOperational) {
        logger.error(`Unexpected error: ${err.message}`, { err, correlationId:req.correlationId});
    }

    res.status(statusCode).json({
        error: IsOperational ? err.message : "An unexpected error occurred. Please try again later.",
        correlationId: req.correlationId
    });
}