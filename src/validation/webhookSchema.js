import {z} from 'zod';
import crypto from 'crypto';

export const webhookSchema = z.object({
    event_id: z.string().default(() => `evt_${crypto.randomUUID().replace(/-/g, '')}`),
    type: z.string().min(1).max(128),
    dag_id: z.string().min(1).max(256),
    timestamp: z.number().int().optional(),
    data: z.record(z.string(), z.unknown()).default({}),
    tenant_id: z.string().optional(),
    conf:z.record( z.unknown()).default({})
});

