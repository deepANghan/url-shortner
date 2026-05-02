import { dbClient } from "@package/db";
import { nanoid } from "nanoid";
import { logger } from "../logger/logger.js";
// import base62 from "base62/index.js";
import { redisClient } from "../config/redisClient.js";
import { persistAnalytics } from "./analytics.service.js";
import { connectToMSGQueue, MQ_CONFIG } from "../config/msgQueueClient.js";

async function getOriginalUrl(shortenUrl: string) {
    try {
        const cacheKey = `url:${shortenUrl}`;

        const cached = await redisClient.get(cacheKey);

        const { channel, connection } = await connectToMSGQueue();

        if (cached) {
            const urlObj = JSON.parse(cached);

            // await persistAnalytics(urlObj.urlId);
            channel.publish(MQ_CONFIG.exchange, 'url.click', Buffer.from(urlObj.urlId));

            return {
                shortenUrl,
                originalUrl: urlObj.originalUrl
            };
        }

        const urlObj = await dbClient.urls.findFirst({
            where: { shortenUrl }
        });

        if (!urlObj) return null;

        channel.publish(MQ_CONFIG.exchange, 'url.click', Buffer.from(urlObj.urlId.toString()));
        // persistAnalytics(urlObj.urlId);

        await redisClient.set(cacheKey, JSON.stringify(urlObj), {
            EX: 3600
        });

        return {
            shortenUrl,
            originalUrl: urlObj.originalUrl
        };

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