import { dbClient } from "../config/client.js";
import { nanoid } from "nanoid";
import { logger } from "../logger/logger.js";
// import base62 from "base62/index.js";
import { redisClient } from "../config/redisClient.js";

async function getOriginalUrl(shortenUrl: string) {

    try {

        let url = await redisClient.get(`url:${shortenUrl}`);

        console.log(`Redis url: ${url}`);

        if (url) {
            return {
                shortenUrl: shortenUrl,
                originalUrl: url
            };
        }

        const urlObj = await dbClient.urls.findFirst({
            where: {
                shortenUrl: shortenUrl
            }
        });

        if (urlObj == null) {
            return null;
        }

        await redisClient.set(`url:${shortenUrl}`, urlObj.originalUrl, {
            EX: 3600
        });

        return urlObj;

    } catch (error) {
        throw new Error("Error while getting original url from shorten url");
    }
}

async function shortenUrl(originalUrl: string) {


    const shortenUrl = nanoid(8);

    try {

        const urlObj = await dbClient.urls.create({
            data: {
                originalUrl: originalUrl,
                shortenUrl: shortenUrl
            }
        });

        return urlObj;
    }
    catch (error) {

        let e = error as Error;

        logger.error({
            event: "URL_SHORTENING",
            message: e.message,
            stack: e.stack
        })

        throw error;
    }
}

export { getOriginalUrl, shortenUrl };