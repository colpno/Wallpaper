import express from "express";

import env from "./configs/env.js";
import { connectDB } from "./lib/database.js";
import configureApp from "./utils/configure-app.js";

const app = express();

configureApp(app);

try {
  console.log("Connecting to database...");
  await connectDB();
  console.log("Connected to database");

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
} catch (error) {
  console.error(error as Error);
  process.exit(1);
}
