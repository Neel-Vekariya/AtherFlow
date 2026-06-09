import { Registry, Counter, Histogram, Gauge, register } from  'prom-client'
import app from "../src/app.ja";

export const registry =new Registry()

export const webhookTotal = new Counter({
    name:'ArherFlow_Webhook_Request_Total',
    help:'Total Webhook Request Received',
    labelNames:['tenamt','event_type','status'],
    registers:[registry]
});

export const webhookLetencySecends = new Histogram({
    name:'Atherflow_webhook_latency_seconds',
    help:'webhook Collection Letency.',
    labelNames:['tenant','event_type'],
    buckets:[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5],
    registers:[registry]
});

export const queueDepth = new Gauge({
    name:"Atherflow_Queue_Depth",
    help:'Current Queue Depth',
    labelNames:['queue_name'],
    registers:[registry]
});


app.use('/matrics',async(req,res)=>{
    res.set('Content-Type', registry.contentType);
    res.send(await registry.metrics())
})