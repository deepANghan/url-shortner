import express from "express";
import dotenv from "dotenv";
import { urlRouter } from "./routes/urls.route.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use("/api/v1/url", urlRouter);

app.listen(PORT, () => console.log(`App started on ${PORT}`));