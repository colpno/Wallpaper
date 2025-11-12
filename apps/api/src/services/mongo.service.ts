import mongoose from "mongoose";

import env from "@/env";

export async function connectDB() {
  if (!env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
