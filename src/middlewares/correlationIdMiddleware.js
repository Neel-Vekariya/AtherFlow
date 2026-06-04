import {randomUUID} from 'crypto';

export default function correlationalId() {
    return (req, res, next) => {
        const Id = req.headers['x-correlation-id'] 
        || req.headers['x-request-Id'] || `af_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
        req.correlationId = Id;
        res.setHeader('x-request-Id', Id);
        next();
    };  
}   