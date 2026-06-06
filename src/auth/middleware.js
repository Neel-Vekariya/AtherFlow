import { verifyToken } from "./jwt.js"
import  ApiError  from "../middlewares/ApiError.js"

export function authMiddleware(req,res,next){
    const authHeader = req.headers['authorization']
    const apiKey = req.headers['x-api-key']
    const API_KEY_MAP = new Map([["test-api-key", "tenant-1"]]);
    try {
        if(authHeader?.startsWith('Bearer ')){
            const token= authHeader.slice(7)    
            req.tenant = verifyToken(token, process.env.JWT_SECRET)
            return next()
        }
        if(apiKey){
            const tenantId = API_KEY_MAP.get(apiKey)
            if(!tenantId){
                throw new ApiError(401,"Invalid Api Key.")
            }
            req.tenant={tenantId, roles: ['webhook:write']}
            return next()
        }
        throw new ApiError(401,"No Credentials Provided.")
    } catch (error) {
        next(error)
    }   

}