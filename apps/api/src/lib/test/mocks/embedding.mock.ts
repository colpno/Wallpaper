import { vi } from "vitest";

export default {
  describeImage: vi
    .fn()
    .mockResolvedValue(
      "A beautiful sunset over a serene lake, with vibrant colors reflecting on the water's surface."
    ),
  toEmbeddings: vi.fn().mockImplementation(() =>
    Promise.resolve(
      Array(10)
        .fill(0)
        .map(() => Math.random().toFixed(4))
    )
  ),
};
