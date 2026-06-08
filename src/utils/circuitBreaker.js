import ApiError from "../middlewares/ApiError"

export class circuitBreaker{
    constructor(failureThreshold,cooldownMs){
        this.failureThreshold=failureThreshold
        this.cooldownMs=cooldownMs
        this.state="CLOSED"
        this.failureCount = 0
        this.lastFailureTime = null
    }

    openCircuit(){
        this.state="OPEN"
        this.lastFailureTime=Date.now()
    }

    closeCircuit(){
        this.state="CLOSED"
        this.failureCount = 0
        this.lastFailureTime = null
    }

    halfOpenCircuit(){
        this.state="HALF_OPEN"
    }


    async execute(fn){
        if(this.state === "OPEN"){
            const cooldownExpired = Date.now() - this.lastFailureTime >= this.cooldownMs
            
            if(!cooldownExpired){
                throw new ApiError(503,"Circuit is open.")
            }   
            this.halfOpenCircuit();
        }

        try{
            const result = await fn()
            if(this.state === "HALF_OPEN"){
                this.closeCircuit()
            }
            return result;
        }catch(error){
            if(this.state === "HALF_OPEN"){
                this.openCircuit()
                throw error;
            }

            this.failureCount ++

            if(this.failureCount >= this.failureThreshold){
                this.openCircuit()
            }
           throw error
        }    
    }
}   