import winston from "winston";
import { configs } from "../config/config.js";

const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()        
    ),

    transports: [
        // 1. All logs
        new winston.transports.File({
            filename: "logs/app.log",
            level:"info"
        }),

        // 2. Only errors
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),

        // 3. Console (useful in dev / debugging)
        ...(configs.NODE_ENV != "production" ?  [new winston.transports.Console()] : [])
    ]
});

export { logger };