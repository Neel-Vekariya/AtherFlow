import { runWithContext } from "../context.js";



export function contextMiddleware(req,res,next){
    runWithContext(
        {
            correlationalId:req.correlationalId, 
            tenantId:req.tenant?.tenantId
        }
        ,next);
}