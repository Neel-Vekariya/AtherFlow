import rateLimit from 'express-rate-limit'
import RadusStore from 'rate-limit-radis'

export const webhookRateLimiter = rateLimit({
    windowMs:60*1000,
    max:1000,
    standarHeaders:true,
    legacyHeader:true,
    store: new RadisStore({
        sendCommand:(...args) => radisClient.call(...args),
    }),
    keyGenerator: (req)=> req.tenant?.tenantId || req.ip,
    handler: (req,res) => {
        res.status(429).json({
            error:'Rate Limit Exceeded',
            retryAfter: res.getHeader('Retry-After'),
        })
    },
})