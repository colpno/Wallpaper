import { faker } from "@faker-js/faker";
import { vi } from "vitest";

export default {
  describeImage: vi.fn().mockResolvedValue(faker.food.description()),
  toEmbeddings: vi.fn().mockImplementation(() =>
    Promise.resolve(
      faker.helpers.multiple(() => faker.number.float({ min: 0, max: 0.9, fractionDigits: 4 }), {
        count: 10,
      })
    )
  ),
};
