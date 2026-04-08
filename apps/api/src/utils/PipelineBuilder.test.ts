import type { PinDB, UserDB } from "@repo/types";
import { beforeEach, describe, expect, it } from "vitest";

import { PinModel } from "@/routes/pin/pin.model.js";
import { seedDatabase, type SeededDB } from "@/test/samples.js";

import { PipelineBuilder } from "./PipelineBuilder.js";

let db: SeededDB;
const pipelineBuilder = new PipelineBuilder({
  fieldToCollectionNameMap: {
    pinOwner: "users",
  },
});

describe("PipelineBuilder", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  it("should build $match stage", async () => {
    const { photoHeight } = db.pins[0]!;

    const pipeline = pipelineBuilder.build<PinDB>({
      photoHeight: { $gte: photoHeight },
    });

    const results = await PinModel.aggregate<PinDB>(pipeline);

    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const result of results) {
      expect(result.photoHeight).toBeGreaterThanOrEqual(photoHeight);
    }
  });

  it("should build $lookup stage", async () => {
    const pipeline = pipelineBuilder.build<PinDB>({
      embed: "pinOwner",
    });

    const results = await PinModel.aggregate<PinDB<UserDB>>(pipeline);

    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.pinOwner).toHaveProperty("_id");
    }
  });

  it("should build $sort stage", async () => {
    const pipeline = pipelineBuilder.build<PinDB>({
      sort: { photoHeight: "desc" },
    });

    const results = await PinModel.aggregate<PinDB>(pipeline);

    expect(results.length).toBe(db.pins.length);
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).toBeDefined();
      if (i > 0) {
        expect(results[i - 1]!.photoHeight).toBeGreaterThanOrEqual(results[i]!.photoHeight);
      }
    }
  });

  it("should build $project stage", async () => {
    const pipeline = pipelineBuilder.build<PinDB>({
      select: { _id: 0, photoHeight: 1 },
    });

    const results = await PinModel.aggregate<PinDB>(pipeline);

    expect(results.length).toBe(db.pins.length);
    for (const result of results) {
      expect(Object.keys(result).length).toBe(1);
      expect(result.photoHeight).toBeDefined();
    }
  });

  it("should build $skip stage", async () => {
    const limit = 2;
    const page = 1;
    const pipeline = pipelineBuilder.build<PinDB>({
      limit,
      page,
    });

    const result = await PinModel.aggregate<PinDB[]>(pipeline);

    expect(result.length).toBe(limit);
  });

  it("should build $limit stage", async () => {
    const limit = 2;
    const pipeline = pipelineBuilder.build<PinDB>({
      limit,
    });

    const result = await PinModel.aggregate<PinDB[]>(pipeline);

    expect(result.length).toBe(limit);
  });
});
