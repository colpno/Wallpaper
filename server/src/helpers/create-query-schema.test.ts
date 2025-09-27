import { describe, expect, it } from "vitest";

import env from "@/lib/env";

import createQuerySchema from "./create-query-schema";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

describe("Query schema validation", () => {
  it("should create and validate successfully", async () => {
    const data = {
      age: { gt: 30 },
      name: { regex: "john", options: "i" },
      status: "active",
      cars: { size: { gt: 2 } },
      or: [{ "person.age": 30 }, { "person.age": { lt: 20 } }],
      not: { status: { in: ["inactive"] } },
      birthday: { gte: new Date("1990-01-01") },
      haveChildren: true,
      wife: { exists: false },
    };

    const result = createQuerySchema<{
      age: number;
      name: string;
      status: string;
      cars: string;
      person: {
        age: number;
      };
      birthday: Date;
      haveChildren: boolean;
      wife: boolean;
    }>({
      age: "number",
      name: "string",
      status: "string",
      cars: "string",
      "person.age": "number",
      birthday: "date",
      haveChildren: "boolean",
      wife: "boolean",
    }).safeParse(data);

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("age", data.age);
    expect(result.data).toHaveProperty("name", data.name);
    expect(result.data).toHaveProperty("status", data.status);
    expect(result.data).toHaveProperty("cars", data.cars);
    expect(result.data).toHaveProperty("or", data.or);
    expect(result.data).toHaveProperty("not", data.not);
    expect(result.data).toHaveProperty("birthday", data.birthday);
    expect(result.data).toHaveProperty("haveChildren", data.haveChildren);
    expect(result.data).toHaveProperty("wife", data.wife);
  });
});
