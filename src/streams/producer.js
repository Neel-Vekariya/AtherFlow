import getRedisClient from "../radis.js"

export async function publishEvent(event){
    const client = getRedisClient()

    const messageId = await client.xadd(
        'atherflow:events',
        'MAXLEN',"~","100000",
        "*",
        "data", JSON.stringify(event)
    );
    return messageId;
}

export async function getQueueDepth() {
    return getRedisClient.client.xlen('atherflow:events')
}