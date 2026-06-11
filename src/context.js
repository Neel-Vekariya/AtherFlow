import { AsyncLocalStorage } from "async_hooks";

const requestContext = new AsyncLocalStorage()

export function runWithContext(context, fn){
    return requestContext.run(context,fn)
}

export function getContext(){
    return requestContext.getStore() || {}
}