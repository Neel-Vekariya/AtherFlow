import getRedisClient from "../radis.js"
import ApiError from "../middlewares/ApiError.js"
import { treeifyError } from "zod/v4/core"
import { errorMonitor } from "supertest/lib/test"
export async function ensureConsumerGroup(stream, group){

    try {
        await getRedisClient.client.xgroup('CREATE', stream, group, '$','MKSTREAM')
    } catch (error) {
        if(!error.message.includes("BUSYGROUP")) throw new ApiError(404,error.message)
    }
}

export async function readMessages(group, customer, count=10){
    const result = await getRedisClient.client.xreadgroup(
        'GROUP',stream, customer,
        'COUNT',count,
        'BLOCK',1000,
        'STREAMS','atherflow:events','>'
    )

    if(!result) return [];
        return result[0][1];
}

export async function aknowlageMessage(stream, group, messageId) {
    await getRedisClient.client.xack(stream, group, messageId)
}


export async function reclaimStalledMessages(stream, group, customer, minIdealTimeMs=30_000){
    const result = await getRedisClient.client.xautoclaim(
        stream, group, customer, 
        minIdealTimeMs, '0-0',
        'COUNT',10
    )
    return result[1]
}