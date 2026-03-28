import { expect, test } from "vitest";

import buildQueryFilterSchema from "./create-query-schema.js";

test("buildQueryFilterSchema", () => {
  const data = {
    age: { gt: 30 },
    name: { regex: "john", options: "i" },
    status: "active",
    cars: { size: { gt: 2 } },
    birthday: { gte: new Date("1990-01-01") },
    haveChildren: true,
    wife: { exists: false },
  };

  const result = buildQueryFilterSchema<{
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
});
