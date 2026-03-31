import { afterAll, afterEach, beforeAll, vi } from "vitest";

import env from "@/configs/env.js";
import { clearCollections, connectDB, disconnectDB } from "@/lib/database.js";

import cloudinaryMocks from "./mocks/cloudinary.js";
import embeddingMocks from "./mocks/embedding.js";

if (env.ENVIRONMENT !== "test") {
  throw new Error("ENVIRONMENT must be 'test'");
}

vi.mock("@/services/cloudinary.ts", () => cloudinaryMocks);
vi.mock("@/services/embedding.ts", () => embeddingMocks);

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
