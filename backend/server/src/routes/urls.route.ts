import { Router } from "express";
import { getURL, postURL } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.get("/:shortUrl", getURL);
urlRouter.post("/", postURL);

export { urlRouter };