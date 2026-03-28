import { describe, expect, it } from "vitest";

import buildMongoFilter from "./build-mongo-filter.js";

describe("buildMongoFilter", () => {
  it("should convert to $regex", async () => {
    const result = buildMongoFilter({
      data: {
        regex: "john",
      },
    });

    expect(result.data).toHaveProperty("$regex", "john");
  });

  it("should convert to $options", async () => {
    const result = buildMongoFilter({
      data: {
        options: "i",
      },
    });

    expect(result.data).toHaveProperty("$options", "i");
  });

  it("should convert to $exists", async () => {
    const result = buildMongoFilter({
      data: {
        exists: true,
      },
    });

    expect(result.data).toHaveProperty("$exists", true);
  });

  it("should convert to $eq", async () => {
    const result = buildMongoFilter({
      data: {
        eq: "John",
      },
    });

    expect(result.data).toHaveProperty("$eq", "John");
  });

  it("should convert to $ne", async () => {
    const result = buildMongoFilter({
      data: {
        ne: "John",
      },
    });

    expect(result.data).toHaveProperty("$ne", "John");
  });

  it("should convert to $gt", async () => {
    const result = buildMongoFilter({
      data: {
        gt: "A",
      },
    });

    expect(result.data).toHaveProperty("$gt", "A");
  });

  it("should convert to $gte", async () => {
    const result = buildMongoFilter({
      data: {
        gte: "A",
      },
    });

    expect(result.data).toHaveProperty("$gte", "A");
  });

  it("should convert to $lt", async () => {
    const result = buildMongoFilter({
      data: {
        lt: "A",
      },
    });

    expect(result.data).toHaveProperty("$lt", "A");
  });

  it("should convert to $lte", async () => {
    const result = buildMongoFilter({
      data: {
        lte: "A",
      },
    });

    expect(result.data).toHaveProperty("$lte", "A");
  });

  it("should convert to $all", async () => {
    const result = buildMongoFilter({
      data: {
        all: ["John", "Jane"],
      },
    });

    expect(result.data).toHaveProperty("$all", ["John", "Jane"]);
  });

  it("should convert to $in", async () => {
    const result = buildMongoFilter({
      data: {
        in: ["John", "Jane"],
      },
    });

    expect(result.data).toHaveProperty("$in", ["John", "Jane"]);
  });

  it("should convert to $nin", async () => {
    const result = buildMongoFilter({
      data: {
        nin: ["John", "Jane"],
      },
    });

    expect(result.data).toHaveProperty("$nin", ["John", "Jane"]);
  });

  it("should convert to $size", async () => {
    const solution1 = {
      size: 2,
    };
    const solution2 = {
      size: {
        eq: 2,
        ne: 2,
        gte: 2,
        gt: 2,
        lte: 2,
        lt: 2,
      },
    };

    const result1 = buildMongoFilter({ data: solution1 });
    const result2 = buildMongoFilter({ data: solution2 });

    expect(result1).toBeDefined();
    expect(result1.data).toHaveProperty("$size", 2);

    expect(result2).toBeDefined();
    expect(result2.data).toHaveProperty("$size");
    expect(result2?.data?.$size).toBeDefined();
    expect(result2?.data?.$size).toHaveProperty("$eq", 2);
    expect(result2?.data?.$size).toHaveProperty("$ne", 2);
    expect(result2?.data?.$size).toHaveProperty("$gte", 2);
    expect(result2?.data?.$size).toHaveProperty("$gt", 2);
    expect(result2?.data?.$size).toHaveProperty("$lte", 2);
    expect(result2?.data?.$size).toHaveProperty("$lt", 2);
  });
});
