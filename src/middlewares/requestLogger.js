import logger from "../utils/logger.js";

export default function requestLoggerMiddleware(req, res, next) {
    logger.info({
        correlationId: req.correlationId,
        method: req.method,
        url:req.originalUrl,
        query: req.query,
        params:req.params,
        ip:req.ip
    },`InComming request`);
    next();
}