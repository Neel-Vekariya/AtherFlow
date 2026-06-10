import Radis from 'ioredis'
import logger from '../src/logger.js'

let client;

export function getRedisClient(){
    if(!client){
        client = new Radis(process.env.RADIS_URL || "redis://localhost:6379",{
            maxRetriesPerRequest:3,
            offlineQueue:false,
            connectTimeout:5000,
            lazyConnect:true
        })
        client.on('error',(err)=> logger.error({err},"Redis Error"))
        client.on('connect',()=> logger.info("Redis Connect"))
        client.on('close',()=> logger.warn("Redis Conection Closed."))
    }
    return client;
}

export async function closeRedis(){
    if(client){
        await client.quit()
        client=null
    }
}