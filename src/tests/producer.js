import { getRedisClient } from '../radis.js'

async function producer(event){
    const client = getRedisClient()
    const messageId =await client.xadd(
        "atherflow:test",
        "MAXLEN","~","1000",
        "*",
        "data",JSON.stringify(event)
    )
    return messageId;
}

async function getQueueDepth() {
    return getRedisClient().xlen('atherflow:test')
}

export  {
    producer,
    getQueueDepth
}