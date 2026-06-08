import {createHmac, timingSafeEqual} from 'crypto';
import ApiError from '../middlewares/ApiError.js';

export function verifyWebhookSignature(signatureHeader,rawBody,secret) {
    if (!signatureHeader) {
        throw new ApiError(401, "No credentials provided");
    }
    if (!signatureHeader.startsWith("sha256=")) {
        throw new ApiError(400, "Invalid signature format");
    }
    if (!secret) {
        throw new ApiError(500, "Webhook secret is not configured");
    }
    if (!rawBody) {
        throw new ApiError(400, "Request body is required");
    }
    const received = signatureHeader.slice(7);
    const expected = createHmac("sha256", secret).update(rawBody)
                    .digest("hex");
    const receivedBuffer = Buffer.from(received, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (
        receivedBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
        throw new ApiError(401, "Invalid credentials");
    }

  return true;
}