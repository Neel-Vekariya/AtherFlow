import { asyncLocalStorage } from "async_hooks"

const requestContext = asyncLocalStorage()

export function runWithContext(context, fn){
    return requestContext.run(context,fn)
}

export function getContext(){
    return requestContext.getStore() || {}
}