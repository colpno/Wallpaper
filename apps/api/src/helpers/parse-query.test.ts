import mongoose from "mongoose";
import { beforeEach, describe, expect, it } from "vitest";

import parseQuery from "./parse-query";

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

describe("parseQuery", async () => {
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

  it("should parse filters", async () => {
    const { filter } = parseQuery<mongoose.ObjectIdToString<A>>({
      age: { gt: 20 },
    });

    const results = await AModel.find(filter);

    expect(results.length).toBe(2);
    for (const result of results) {
      expect(result.age).toBeGreaterThan(20);
    }
  });

  it("should parse sort", async () => {
    const { sort } = parseQuery<mongoose.ObjectIdToString<A>>({
      sort: { age: "desc" },
    });

    expect(sort).toBeDefined();

    const results = await AModel.find().sort(sort!);

    expect(results.length).toBe(aItems.length);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].age).toBeGreaterThanOrEqual(results[i].age);
    }
  });

  it("should parse select", async () => {
    const { select } = parseQuery<mongoose.ObjectIdToString<A>>({
      select: ["age"],
    });

    expect(select).toBeDefined();

    const results = await AModel.find().select(select!);

    expect(results.length).toBe(aItems.length);
    for (const result of results) {
      expect(result.age).toBeDefined();
      expect(result.person).toBeUndefined();
    }
  });

  it("should parse limit", async () => {
    const { limit } = parseQuery<mongoose.ObjectIdToString<A>>({
      limit: 2,
    });

    expect(limit).toBe(2);

    const results = await AModel.find().limit(limit!);

    expect(results.length).toBe(2);
  });

  it("should parse page", async () => {
    const { skip, limit, page } = parseQuery<mongoose.ObjectIdToString<A>>({
      limit: 2,
      page: 2,
    });

    expect(skip).toBeDefined();
    expect(limit).toBe(2);
    expect(page).toBe(2);

    const results = await AModel.find().skip(skip!).limit(limit!);

    expect(results.length).toBe(
      limit! * page! <= aItems.length ? limit! : aItems.length - limit! * (page! - 1)
    );
  });

  describe("embed parsing", async () => {
    it("should parse string embed", async () => {
      const { embed } = parseQuery<mongoose.ObjectIdToString<A>>({
        embed: "person",
      });

      expect(embed).toBe("person");

      const results = await AModel.find().populate(embed as string);

      expect(results.length).toBe(aItems.length);
      for (const result of results) {
        expect(result.person).toHaveProperty("_id");
        expect(mongoose.Types.ObjectId.isValid(result.person._id)).toBe(true);
      }
    });

    it("should parse array of strings embed", async () => {
      const { embed } = parseQuery<mongoose.ObjectIdToString<A>>({
        embed: ["person"],
      });

      expect(embed).toStrictEqual(["person"]);

      const results = await AModel.find().populate(embed as string[]);

      expect(results.length).toBe(aItems.length);
      for (const result of results) {
        expect(result.person).toHaveProperty("_id");
        expect(mongoose.Types.ObjectId.isValid(result.person._id)).toBe(true);
      }
    });

    it("should parse object embed", async () => {
      const { embed } = parseQuery<mongoose.ObjectIdToString<A>>({
        embed: {
          path: "person",
          match: {
            name: "Bob",
          },
        },
      });

      expect(embed).toBeDefined();

      const docs = await AModel.find().populate(embed as string);
      const results = docs.filter((doc) => doc.person !== null);

      expect(results.length).toBe(1);
      for (const result of results) {
        expect(result.person).toHaveProperty("_id");
        expect(mongoose.Types.ObjectId.isValid(result.person._id)).toBe(true);
      }
    });

    it("should parse array of objects embed", async () => {
      const { embed } = parseQuery<mongoose.ObjectIdToString<A>>({
        embed: [
          {
            path: "person",
            match: {
              name: "Bob",
            },
          },
        ],
      });

      expect(embed).toBeDefined();

      const docs = await AModel.find().populate(embed as string[]);
      const results = docs.filter((doc) => doc.person !== null);

      expect(results.length).toBe(1);
      for (const result of results) {
        expect(result.person).toHaveProperty("_id");
        expect(mongoose.Types.ObjectId.isValid(result.person._id)).toBe(true);
      }
    });
  });
});
