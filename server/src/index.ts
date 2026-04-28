import express, { type NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import { urlRouter } from "./routes/urls.route.js";
import { configs } from "./config/config.js";
import { requestLogger } from "./middleware/requestLogger.js";

dotenv.config();

const app = express();
const PORT = configs.PORT;

app.use(express.json());

app.use(requestLogger);

app.use("/api/v1/url", urlRouter);

app.use((req : Request, res : Response, next : NextFunction) => {

    res.status(404).json({
        status: "Not Found",
        message: "Route not found"
    })

    return ;
});

app.use((err : unknown, req : Request, res : Response, next : NextFunction) =>  {

    const error = err as Error;

    res.status(500).json({
        status: "server error",
        message: error.message
    })

    return;
});

app.listen(PORT, () => console.log(`App started on ${PORT}`));