import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import env from "@/env";
import { clearCollections, connectDB, disconnectDB } from "@/services/mongo.service";

import cloudinaryMocks from "./mocks/cloudinary.mock";
import embeddingMocks from "./mocks/embedding.mock";

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

beforeEach(async () => {
  await clearCollections();
});

afterEach(() => {
  vi.clearAllMocks();
});
