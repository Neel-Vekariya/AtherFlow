import { producer,getQueueDepth }  from "./producer.js";
import { createWorker,startConsumer} from "./consumer.js"



async function ganaratetask() {
    for(let i = 0; i < 1000; i ++){
        await producer({
            id:i,
            payload:`event-${i}`
        })
        console.log(`Task No: ${i} created.`);
        const depth =getQueueDepth()
        console.log("Queue Depth:", depth);
        
        await new Promise(r => setTimeout(r,10))
    }
}
async function main() {

       await createWorker(
        "atherflow:test",
        "workers"
    );

    startConsumer(
        "atherflow:test",
        "consumer-1"
    );
    await ganaratetask();

    startConsumer(
        "atherflow:test",
        "consumer-1"
    );
}


    

main().catch(console.error);