export async function withRetry(fn, options={}){
    const {
        maxAttempts = 5,
        baseDelay = 100,
        maxDelay = 30_000,
        shouldRetry = (error) => error.status >= 500,
        onRetry = () =>{}
    }=options

    let lastError;
    for(let Attempt = 0; Attempt < maxAttempts; Attempt++){
        try {
            return await fn()
            }
        catch (error) {
            lastError = error
            
            if(Attempt === maxAttempts - 1) break
            
            if(!shouldRetry(error,Attempt)) break
            
            const exponentialDelay = Math.min(maxDelay, baseDelay * Math.pow(2, Attempt))
            const jitterdDelay = Math.random() * exponentialDelay
            
            onRetry({Attempt, delay: jitterdDelay, error:error})
            await sleep(jitterdDelay)
        }
    }
    throw lastError
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}

