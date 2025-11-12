import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import env from "@/env";
import { clearCollections, connectDB, disconnectDB } from "@/services/mongo.service";

import cloudinaryMocks from "./mocks/cloudinary.mock";

if (env.ENVIRONMENT !== "test") {
  throw new Error("ENVIRONMENT must be 'test'");
}

vi.mock("@/services/cloudinary.service.ts", () => cloudinaryMocks);

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
