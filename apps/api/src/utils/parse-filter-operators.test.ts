import { describe, expect, it } from "vitest";

import parseFilterOperators from "./parse-filter-operators.js";

describe("parseQuerySelectors", () => {
  it("should parse to $regex", () => {
    const result = parseFilterOperators({ regex: "john" });

    expect(result).toHaveProperty("$regex", "john");
  });

  it("should parse to $options", () => {
    const result = parseFilterOperators({ options: "i" });

    expect(result).toHaveProperty("$options", "i");
  });

  it("should parse to $exists", () => {
    const result = parseFilterOperators({ exists: true });

    expect(result).toHaveProperty("$exists", true);
  });

  it("should parse to $eq", () => {
    const result = parseFilterOperators({ eq: "John" });

    expect(result).toHaveProperty("$eq", "John");
  });

  it("should parse to $ne", () => {
    const result = parseFilterOperators({ ne: "John" });

    expect(result).toHaveProperty("$ne", "John");
  });

  it("should parse to $gt", () => {
    const result = parseFilterOperators({ gt: "A" });

    expect(result).toHaveProperty("$gt", "A");
  });

  it("should parse to $gte", () => {
    const result = parseFilterOperators({ gte: "A" });

    expect(result).toHaveProperty("$gte", "A");
  });

  it("should parse to $lt", () => {
    const result = parseFilterOperators({ lt: "A" });

    expect(result).toHaveProperty("$lt", "A");
  });

  it("should parse to $lte", () => {
    const result = parseFilterOperators({ lte: "A" });

    expect(result).toHaveProperty("$lte", "A");
  });

  it("should parse to $all", () => {
    const result = parseFilterOperators({ all: ["John", "Jane"] });

    expect(result).toHaveProperty("$all", ["John", "Jane"]);
  });

  it("should parse to $in", () => {
    const result = parseFilterOperators({ in: ["John", "Jane"] });

    expect(result).toHaveProperty("$in", ["John", "Jane"]);
  });

  it("should parse to $nin", () => {
    const result = parseFilterOperators({ nin: ["John", "Jane"] });

    expect(result).toHaveProperty("$nin", ["John", "Jane"]);
  });

  describe("should parse to $size", () => {
    it("should parse a number", () => {
      const result = parseFilterOperators({ size: 2 });

      expect(result).toHaveProperty("$size", 2);
    });

    it("should parse a condition object", () => {
      const result = parseFilterOperators({
        size: {
          eq: 2,
          ne: 2,
          gte: 2,
          gt: 2,
          lte: 2,
          lt: 2,
        },
      });

      expect(result).toHaveProperty("$size", {
        $eq: 2,
        $ne: 2,
        $gte: 2,
        $gt: 2,
        $lte: 2,
        $lt: 2,
      });
    });
  });
});
