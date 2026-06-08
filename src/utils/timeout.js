

export function withTimeout(promise, ms ,errorMessage = "Operation timed out"){
    const timeout = new Promise((_, reject) => 
        setTimeout(()=> reject(new Error(errorMessage)), ms)
    )

    return Promise.race([promise,timeout])
}


export function fetchWithTimeout(url, options = {}, timeoutMs = 10_000){
    const controller = new AbortController()
    const timer = setTimeout(()=> controller.abort(),timeoutMs)

    return fetch(url, { ...potions, signal:controller.signal}).
        finally(() => clearTimeout(timer))
}