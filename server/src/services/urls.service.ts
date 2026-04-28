import { dbClient } from "../config/client.js";
import { nanoid } from "nanoid";
import { logger } from "../logger/logger.js";
// import base62 from "base62/index.js";

async function getOriginalUrl(shortenUrl: string) {

    try {
        
        const urlObj = await dbClient.urls.findFirst({
            where: {
                shortenUrl: shortenUrl
            }
        });

        if(urlObj == null) {
            return null;
        }
 
        return urlObj;

    } catch (error) {
        throw new Error("Error while getting original url from shorten url");
    }


}

async function shortenUrl(originalUrl: string) {
    

    const shortenUrl = nanoid(8);

    try
    {

        const urlObj = await dbClient.urls.create({
            data: {
                originalUrl: originalUrl,
                shortenUrl: shortenUrl
            }
        });
        
        return urlObj;
    }
    catch(error) {

        let e = error as Error;

        logger.error({
            event:"URL_SHORTENING",
            message: e.message,
            stack: e.stack
        })

        throw error;
    }
}

export { getOriginalUrl, shortenUrl };