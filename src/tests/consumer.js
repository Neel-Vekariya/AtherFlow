import ApiError from "../middlewares/ApiError.js"
import { getRedisClient} from "../radis.js"

async function createWorker(stream, workers){
    const client = getRedisClient()
    try {
        await client.xgroup("CREATE",stream,workers,"0","MKSTREAM")
        console.log(`Worker Created.`);
        
    } catch (error) {
        if(!error.message.includes("BUSYGROUP")){
            throw  new ApiError(404,error.message)
        }
    }
}

async function readMessage(stream,workers,worker,count=10){
    console.log("Reading from stream:", stream);

    const result = await getRedisClient().xreadgroup(
        'GROUP',workers,worker,
        "COUNT",count,
        "BLOCK",1000,
        "STREAMS",stream,">"
    );
    if(!result) return []
    console.log(JSON.stringify(result, null, 2));
    const [, messages] = result[0];
    return messages || [];
} 
    

async function startConsumer(stream,consumer){
    console.log("Consumer started");
    while(true){

        const messages = await readMessage(
            stream,
            "workers",
            consumer    
        );
        console.log(JSON.stringify(messages, null, 2));
        for(const msg of messages){
            const id = msg[0];
            const data = JSON.parse(msg[1][1]);

            console.log("recived",id)

            await new Promise((r)=>(setTimeout(r,50)))

            await acked(id,stream)

            console.log("acked",id) 
        }
    }
}

async function acked(id,stream){
    return getRedisClient().xack(stream,"workers",id)
}

export  {
    createWorker,
    readMessage,
    startConsumer,
    acked
}