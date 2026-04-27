import type { Request, Response } from "express";
import { getOriginalUrl, shortenUrl } from "../services/urls.service.js";


async function getURL(req : Request, res : Response) {


    const { shortUrl } = req.params;

    if(shortUrl == null) {
        res.status(400).json({
            message: "Short url is required",
            errorCode:"SHORT_URL_REQUIRED",
            success: false
        });
        return;
    }

    try {
        
        const urlObj = await getOriginalUrl(shortUrl as string);

        if(urlObj == null) {
            res.status(404).json({
                message: "Shorten url not found",
                errorCode:"SHORTEN_URL_NOT_FOUND",
                success: false
            });

            return ;
        }

        res.status(201).json({
            success: true,
            data : {
                originalUrl: urlObj.originalUrl,
                shortenUrl: urlObj.shortenUrl
            }
        });

        return ;    

    } catch (error) {
        
        let e = error as Error;

        res.status(500).json({
            message: e.message,
            errorCode:"DATABASE_ERROR",
            success: false
        });

        return ;

    }

}

async function postURL(req : Request, res : Response) {

    const { originalUrl } = req.body;

    if(originalUrl == null) {
        
        res.status(400).json({
            message: "Original url is required",
            errorCode:"ORIGINAL_URL_REQUIRED",
            success: false
        });

        return ;
    }

    try {
        const urlObj = await shortenUrl(originalUrl);
        
        res.status(201).json({
            message: "URL shortened Successfully",
            success: true,
            data : {
                originalUrl: urlObj.originalUrl,
                shortenUrl: urlObj.shortenUrl
            }
        });

        return ;

    } catch (error) {

        let e = error as Error;

        res.status(500).json({
            message: e.message,
            errorCode:"DATABASE_ERROR",
            success: false
        });

        return;
    }

}

export { 
  getURL,
  postURL
};