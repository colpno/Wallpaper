import { connect } from "mongoose";

import env from "@/lib/env";

export async function connectDB() {
  try {
    await connect(env.MONGODB_URI);
    console.log("Connected to database.");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}
