import pino from "pino";
import { version } from "react";
import { getContext } from "./context.js";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    formatters:{
        level: (lable)=>({level:lable})
    },
    base:{
        service:'atherfloe_gateway',
        version:process.env.npm_package_version,
        env:process.env.NODE_ENV,
    },
    maxin(){
        return getContext()
    },
    timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;