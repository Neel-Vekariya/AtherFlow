import express from "express";
import dotenv from "dotenv";
import correlationalId from "./middlewares/correlationIdMiddleware.js";
import requestLoggerMiddleware from "./middlewares/requestLogger.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import router from "./routes/health.js";
import webhookRouter from "./routes/webhook.js";
const app = express();
dotenv.config({
    path:'./.env'
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(correlationalId());   
app.use(requestLoggerMiddleware);
app.use("/webhook", webhookRouter);


app.use(router);
app.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.send("Hello, World!");
});


app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.use(ErrorHandler);
export default app;