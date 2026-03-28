import express from "express";

import env from "./configs/env.js";
import configureApp from "./helpers/configure-app.js";
import { connectDB } from "./services/mongo.service.js";

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
