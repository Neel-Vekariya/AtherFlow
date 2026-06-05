import {createHmac, timingSafeEqual} from 'crypto';
import ApiError from '../middlewares/ErrorHandler';


export function verifyWebhookSignature(signatureHeader, rowBody, secret){
    if(!signatureHeader?.startsWith('sha256=')){
        throw new ApiError(400,"Invalid Signature Format.")
    }

    const recived = signatureHeader.slice(7); // Remove 'sha256'
    const expected = createHmac('sha256', secret)
                    .update(rowBody).digest('hex')

    const recivedbuff = Buffer.from(recived, 'hex')
    const expectedbuff = Buffer.from(expected, 'hex')

    if(recivedbuff.length !== expectedbuff.length || timingSafeEqual(recivedbuff,expectedbuff)){
        throw new ApiError(401,"Webhook Signature verification failed.")
    }
}