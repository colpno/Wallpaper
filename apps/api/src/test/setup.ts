import { afterAll, afterEach, beforeAll, vi } from "vitest";

import env from "@/configs/env.js";
import { clearCollections, connectDB, disconnectDB } from "@/services/mongo.service.js";

import cloudinaryMocks from "./mocks/cloudinary.mock.js";
import embeddingMocks from "./mocks/embedding.mock.js";

if (env.ENVIRONMENT !== "test") {
  throw new Error("ENVIRONMENT must be 'test'");
}

vi.mock("@/services/cloudinary.service.ts", () => cloudinaryMocks);
vi.mock("@/services/embedding.service.ts", () => embeddingMocks);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  vi.clearAllMocks();
  await clearCollections();
});
