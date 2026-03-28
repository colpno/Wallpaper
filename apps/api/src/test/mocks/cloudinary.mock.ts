import { faker } from "@faker-js/faker";
import { vi } from "vitest";

export default {
  uploadFile: vi.fn().mockImplementation(() =>
    Promise.resolve({
      public_id: faker.string.alphanumeric({ length: 20, casing: "lower" }),
      width: faker.number.int({ min: 200, max: 1000 }),
      height: faker.number.int({ min: 200, max: 1000 }),
      format: "jpg",
      bytes: faker.number.int({ min: 10000, max: 50000 }),
      secure_url: `https://res.cloudinary.com/${faker.system.commonFileName("jpg")}`,
      resource_type: "image",
    })
  ),
  deleteFile: vi.fn().mockResolvedValue("ok"),
  deleteFiles: vi.fn().mockResolvedValue({ deleted: {}, partial: {} }),
};
