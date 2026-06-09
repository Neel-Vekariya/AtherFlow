import logger from "../logger.js";

export default function requestLoggerMiddleware(req, res, next) {
    const start = Date.now()

    res.on('finish',()=>{
        const skip = ['/health','/ready','/metrics'].includes(req.path);

        if(skip) return;

    logger.info({
        msg:"http_request",
        method:req.method,
        path:req.path,
        statusCode:res.statusCode,
        latencyMs:Date.now() - start,
        userAgent:req.headers['user-agent'],
    })
    })
    next();
}