import { describe, expect, it } from "vitest";

import env from "@/lib/env";

import buildMongoFilter from "./build-mongo-filter";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("Mongoose filter converting", () => {
  it("should convert to $regex", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        regex: "john",
      },
    });

    expect(result).toHaveProperty("$regex", "john");
  });

  it("should convert to $options", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        options: "i",
      },
    });

    expect(result).toHaveProperty("$options", "i");
  });

  it("should convert to $exists", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        exists: true,
      },
    });

    expect(result).toHaveProperty("$exists", true);
  });

  it("should convert to $eq", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        eq: "John",
      },
    });

    expect(result).toHaveProperty("$eq", "John");
  });

  it("should convert to $ne", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        ne: "John",
      },
    });

    expect(result).toHaveProperty("$ne", "John");
  });

  it("should convert to $gt", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        gt: "A",
      },
    });

    expect(result).toHaveProperty("$gt", "A");
  });

  it("should convert to $gte", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        gte: "A",
      },
    });

    expect(result).toHaveProperty("$gte", "A");
  });

  it("should convert to $lt", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        lt: "A",
      },
    });

    expect(result).toHaveProperty("$lt", "A");
  });

  it("should convert to $lte", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        lte: "A",
      },
    });

    expect(result).toHaveProperty("$lte", "A");
  });

  it("should convert to $all", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        all: ["John", "Jane"],
      },
    });

    expect(result).toHaveProperty("$all", ["John", "Jane"]);
  });

  it("should convert to $in", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        in: ["John", "Jane"],
      },
    });

    expect(result).toHaveProperty("$in", ["John", "Jane"]);
  });

  it("should convert to $nin", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        nin: ["John", "Jane"],
      },
    });

    expect(result).toHaveProperty("$nin", ["John", "Jane"]);
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

    const { data: solution1Result } = buildMongoFilter({ data: solution1 });
    const { data: solution2Result } = buildMongoFilter({ data: solution2 });

    expect(solution1Result).toBeDefined();
    expect(solution1Result).toHaveProperty("$size", 2);

    expect(solution2Result).toBeDefined();
    expect(solution2Result).toHaveProperty("$size");
    expect(solution2Result!.$size).toBeDefined();
    expect(solution2Result!.$size).toHaveProperty("$eq", 2);
    expect(solution2Result!.$size).toHaveProperty("$ne", 2);
    expect(solution2Result!.$size).toHaveProperty("$gte", 2);
    expect(solution2Result!.$size).toHaveProperty("$gt", 2);
    expect(solution2Result!.$size).toHaveProperty("$lte", 2);
    expect(solution2Result!.$size).toHaveProperty("$lt", 2);
  });

  it("should convert to $not", async () => {
    const { data: result } = buildMongoFilter({
      data: {
        not: { gt: 30 },
      },
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("$not");
    expect(result!.$not).toBeDefined();
    expect(result!.$not).toHaveProperty("$gt", 30);
  });

  it("should convert to $and", async () => {
    const result = buildMongoFilter({
      and: [{ data: 30 }, { data: { lt: 20 } }],
    });

    expect(result).toHaveProperty("$and");
    expect(result.$and).toBeDefined();
    expect(result.$and).toHaveLength(2);
    for (const item of result.$and!) {
      expect(item).toHaveProperty("data");
    }
    expect(result.$and![0].data).toBe(30);
    expect(result.$and![1].data).toHaveProperty("$lt", 20);
  });

  it("should convert to $or", async () => {
    const result = buildMongoFilter({
      or: [{ data: 30 }, { data: { lt: 20 } }],
    });

    expect(result).toHaveProperty("$or");
    expect(result.$or).toBeDefined();
    expect(result.$or).toHaveLength(2);
    for (const item of result.$or!) {
      expect(item).toHaveProperty("data");
    }
    expect(result.$or![0].data).toBe(30);
    expect(result.$or![1].data).toHaveProperty("$lt", 20);
  });

  it("should convert to $nor", async () => {
    const result = buildMongoFilter({
      nor: [{ data: 30 }, { data: { lt: 20 } }],
    });

    expect(result).toHaveProperty("$nor");
    expect(result.$nor).toBeDefined();
    expect(result.$nor).toHaveLength(2);
    for (const item of result.$nor!) {
      expect(item).toHaveProperty("data");
    }
    expect(result.$nor![0].data).toBe(30);
    expect(result.$nor![1].data).toHaveProperty("$lt", 20);
  });
});
