import { expect, test } from "vitest";
import z from "zod";

import { createQueryFilterSchema } from "./create-query-filter-schema.js";

test("createQueryFilterSchema", () => {
  const schema = createQueryFilterSchema<{
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
  }>()({
    age: z.coerce.number(),
    name: z.string(),
    status: z.string(),
    cars: z.string(),
    "person.age": z.coerce.number(),
    birthday: z.coerce.date(),
    haveChildren: z.coerce.boolean(),
    wife: z.coerce.boolean(),
  });

  const data = {
    age: { gt: 30 },
    name: { regex: "john", options: "i" },
    status: "active",
    cars: { size: { gt: 2 } },
    birthday: { gte: new Date("1990-01-01") },
    haveChildren: true,
    wife: { exists: false },
  };
  const result = schema.safeParse(data);

  expect(result.success).toBe(true);
  expect(result.data).toHaveProperty("age", { $gt: data.age.gt });
  expect(result.data).toHaveProperty("name", {
    $regex: data.name.regex,
    $options: data.name.options,
  });
  expect(result.data).toHaveProperty("status", data.status);
  expect(result.data).toHaveProperty("cars", { $size: { $gt: data.cars.size.gt } });
  expect(result.data).toHaveProperty("birthday", { $gte: data.birthday.gte });
  expect(result.data).toHaveProperty("haveChildren", data.haveChildren);
  expect(result.data).toHaveProperty("wife", { $exists: data.wife.exists });
});
