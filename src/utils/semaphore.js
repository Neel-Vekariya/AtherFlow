
export class semaphore{
    constructor(maxConcurrent){
        this.maxConcurrent=maxConcurrent
        this.current= 0
        this.queue= []
    }

    acquire(){
        return new Promise((resolve)=>{
            if(this.current < this.maxConcurrent){
                this.current++;
                resolve();
            }
            else{
                this.queue.push(resolve)
            }
        })
    }


    release(){
        this.current--;
        if(this.queue.length > 0 ){
            this.current++;
            const next = this.queue.shift()
            next();
        }
    }

    async run(fu){
        await this.acquire();
        try{
            return await fu()
        }finally{
            this.release()
        }
    }
}