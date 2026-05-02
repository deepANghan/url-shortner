import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger/logger.js";


export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const start = Date.now();

    res.on("finish", () => {
        logger.info("HTTP_REQUEST", {
            method: req.method,
            url: req.path,
            status: res.statusCode,
            duration: Date.now() - start
        });
    });

    next();
};