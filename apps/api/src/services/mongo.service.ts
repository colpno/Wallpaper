import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import env from "@/env";

const memoryDB = await MongoMemoryServer.create();

export async function connectDB() {
  if (env.ENVIRONMENT === "test") {
    const uri = memoryDB.getUri();

    await mongoose.connect(uri);

    return;
  }

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
  if (env.ENVIRONMENT === "test") {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await memoryDB.stop();
  }

  await mongoose.disconnect();
}

export async function clearCollections() {
  if (env.ENVIRONMENT !== "test") {
    throw new Error("clearCollections can only be used in test environment");
  }

  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}
