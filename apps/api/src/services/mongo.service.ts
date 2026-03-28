import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import env from "@/configs/env.js";

const memoryDB = env.ENVIRONMENT === "test" ? await MongoMemoryServer.create() : undefined;

export async function connectDB() {
  if (memoryDB) {
    const uri = memoryDB.getUri();
    return await mongoose.connect(uri);
  }

  return await mongoose.connect(env.MONGODB_URI);
}

export async function disconnectDB() {
  if (memoryDB) {
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
    await collection?.deleteMany();
  }
}
