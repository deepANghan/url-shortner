import express, { type NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import { urlRouter } from "./routes/urls.route.js";
import { configs } from "./config/config.js";
import { requestLogger } from "./middleware/requestLogger.js";
import cors from "cors";
import { redisClient } from "./config/redisClient.js";
import { dbClient } from "./config/client.js";

dotenv.config();

const app = express();
const PORT = configs.PORT;

app.use(cors({
    origin: ["http://127.0.0.1:5500"]
}));

app.use(express.json());
app.use(requestLogger);

app.use("/api/v1/url", urlRouter);

app.use((req: Request, res: Response, next: NextFunction) => {

    res.status(404).json({
        status: "Not Found",
        message: "Route not found"
    })

    return;
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {

    const error = err as Error;

    res.status(500).json({
        status: "server error",
        message: error.message
    })

    return;
});

app.listen(PORT, () => console.log(`App started on ${PORT}`));

process.on("SIGINT", async () => {
    console.log("Server stopped");
    await redisClient.quit();
    await dbClient.$disconnect();
    process.exit(0);
});