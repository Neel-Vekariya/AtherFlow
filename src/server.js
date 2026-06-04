import app from "./app.js";

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port http://localhost:8000");
});

async function gracefulShutdown (signal){
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async() => {
        console.log("Server closed. Exiting process.");
        process.exit(0);
    });

    setTimeout(() => {
        console.error("Could not close connections in time. Forcefully shutting down.");
        process.exit(1);
    }, 10000); 
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

