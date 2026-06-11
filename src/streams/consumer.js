import { getRedisClient } from "../radis.js"
import ApiError from "../middlewares/ApiError.js"


async function ensureConsumerGroup(stream, group){

    try {
        await getRedisClient().xgroup('CREATE', stream, group, '$','MKSTREAM')
    } catch (error) {
        if(!error.message.includes("BUSYGROUP")) throw new ApiError(404,error.message)
    }
}

async function readMessages(group, customer, count=10){
    const result = await getRedisClient.client.xreadgroup(
        'GROUP',stream, customer,
        'COUNT',count,
        'BLOCK',1000,
        'STREAMS','atherflow:events','>'
    )

    if(!result) return [];
        return result[0][1];
}

async function aknowlageMessage(stream, group, messageId) {
    await getRedisClient.client.xack(stream, group, messageId)
}


async function reclaimStalledMessages(stream, group, customer, minIdealTimeMs=30_000){
    const result = await getRedisClient.client.xautoclaim(
        stream, group, customer, 
        minIdealTimeMs, '0-0',
        'COUNT',10
    )
    return result[1]
}


export  {
    ensureConsumerGroup,
    readMessages,
    aknowlageMessage,
    reclaimStalledMessages
}