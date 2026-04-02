let server: import("http").Server | undefined;

import express from "express";

import env from "./configs/env.js";
import { connectDB } from "./lib/database.js";
import configureApp from "./utils/configure-app.js";

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

const app = express();

configureApp(app);

try {
  console.log("Connecting to database...");
  await connectDB();
  console.log("Connected to database");

  server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
} catch (error) {
  console.error(error as Error);
  process.exit(1);
}
