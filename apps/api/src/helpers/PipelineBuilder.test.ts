import type { PaginationPayload, PostDB, UserDB } from "@repo/types";
import { beforeEach, describe, expect, it } from "vitest";

import PostModel from "@/routes/post/post.model.js";
import { seedDatabase, type SeededDB } from "@/test/samples.js";

import PipelineBuilder from "./PipelineBuilder.js";

let db: SeededDB;
const pipelineBuilder = new PipelineBuilder({
  fieldToCollectionNameMap: {
    postOwner: "users",
  },
});

describe("PipelineBuilder", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  it("should build $match stage", async () => {
    const { photoHeight } = db.posts[0]!;

    const pipeline = pipelineBuilder.build<PostDB>({
      photoHeight: { gte: photoHeight },
    });

    const results = await PostModel.aggregate<PostDB>(pipeline);

    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const result of results) {
      expect(result.photoHeight).toBeGreaterThanOrEqual(photoHeight);
    }
  });

  it("should build $lookup stage", async () => {
    const pipeline = pipelineBuilder.build<PostDB>({
      embed: "postOwner",
    });

    const results = await PostModel.aggregate<PostDB<UserDB>>(pipeline);

    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.postOwner).toHaveProperty("_id");
    }
  });

  it("should build $sort stage", async () => {
    const pipeline = pipelineBuilder.build<PostDB>({
      sort: { photoHeight: "desc" },
    });

    const results = await PostModel.aggregate<PostDB>(pipeline);

    expect(results.length).toBe(db.posts.length);
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).toBeDefined();
      if (i > 0) {
        expect(results[i - 1]!.photoHeight).toBeGreaterThanOrEqual(results[i]!.photoHeight);
      }
    }
  });

  it("should build $project stage", async () => {
    const pipeline = pipelineBuilder.build<PostDB>({
      select: { _id: 0, photoHeight: 1 },
    });

    const results = await PostModel.aggregate<PostDB>(pipeline);

    expect(results.length).toBe(db.posts.length);
    for (const result of results) {
      expect(Object.keys(result).length).toBe(1);
      expect(result.photoHeight).toBeDefined();
    }
  });

  it("should build $skip stage", async () => {
    const limit = 2;
    const page = 1;
    const pipeline = pipelineBuilder.build<PostDB>({
      limit,
      page,
    });

    const result = await PostModel.aggregate<PaginationPayload<PostDB[]>>(pipeline);

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("data");
    expect(result[0]!.data).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty(
      "meta",
      expect.objectContaining({
        perPage: limit,
      } satisfies Partial<PaginationPayload<unknown[]>["meta"]>)
    );
    expect(result[0]!.data.length).toBe(limit);
  });

  it("should build $limit stage", async () => {
    const limit = 2;
    const pipeline = pipelineBuilder.build<PostDB>({
      limit,
    });

    const result = await PostModel.aggregate<PaginationPayload<PostDB[]>>(pipeline);

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("data");
    expect(result[0]!.data).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty(
      "meta",
      expect.objectContaining({
        perPage: limit,
      } satisfies Partial<PaginationPayload<unknown[]>["meta"]>)
    );
    expect(result[0]!.data.length).toBe(limit);
  });
});
