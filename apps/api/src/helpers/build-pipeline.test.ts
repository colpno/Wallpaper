import mongoose from "mongoose";
import { beforeEach, describe, expect, it } from "vitest";

import buildPipeline from "./build-pipeline";

type B = {
  name: string;
};
type A = {
  age: number;
  person: mongoose.Types.ObjectId;
};

const BModel = mongoose.model(
  "b",
  new mongoose.Schema<B>({
    name: String,
  }),
  "b"
);
const AModel = mongoose.model(
  "a",
  new mongoose.Schema<A>({
    age: Number,
    person: { type: mongoose.Schema.Types.ObjectId, ref: "b" },
  }),
  "a"
);

describe("buildPipeline", () => {
  const bItems = [
    new BModel({ name: "Alice" }),
    new BModel({ name: "Bob" }),
    new BModel({ name: "Charlie" }),
  ];
  const aItems = [
    new AModel({ age: 25, person: bItems[0]._id }),
    new AModel({ age: 5, person: bItems[1]._id }),
    new AModel({ age: 55, person: bItems[2]._id }),
  ];

  beforeEach(async () => {
    await BModel.insertMany(bItems);
    await AModel.insertMany(aItems);
  });

  it("should build $match stage", async () => {
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>({
      age: { gt: 20 },
    });

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(2);
    for (const result of results) {
      expect(result.age).toBeGreaterThan(20);
    }
  });

  it("should build $lookup stage", async () => {
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>(
      {
        embed: "person",
      },
      {
        fieldToCollectionMap: {
          person: "b",
        },
      }
    );

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(aItems.length);
    for (const result of results) {
      expect(result.person).toHaveProperty("_id");
      expect(mongoose.Types.ObjectId.isValid(result.person._id)).toBe(true);
    }
  });

  it("should build $sort stage", async () => {
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>({
      sort: { age: "desc" },
    });

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(aItems.length);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].age).toBeGreaterThanOrEqual(results[i].age);
    }
  });

  it("should build $project stage", async () => {
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>({
      select: ["age"],
    });

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(aItems.length);
    for (const result of results) {
      expect(result.age).toBeDefined();
      expect(result.person).toBeUndefined();
    }
  });

  it("should build $skip stage", async () => {
    const limit = 2;
    const page = 2;
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>({
      limit,
      page,
    });

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(
      limit * page <= aItems.length ? limit : aItems.length - limit * (page - 1)
    );
  });

  it("should build $limit stage", async () => {
    const limit = 2;
    const pipeline = buildPipeline<mongoose.ObjectIdToString<A>>({
      limit,
    });

    const results = await AModel.aggregate(pipeline);

    expect(results.length).toBe(limit);
  });
});
