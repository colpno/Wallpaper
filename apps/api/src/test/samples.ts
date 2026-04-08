import type { Types } from "mongoose";

import { faker } from "@faker-js/faker";
import type { ExpiredMedia, ExpiredMediaDB, Pin, PinDB, User, UserDB } from "@repo/types";

import { ExpiredMediaModel } from "@/routes/media/expired-media.model.js";
import { PinModel } from "@/routes/pin/pin.model.js";
import { UserModel } from "@/routes/user/user.model.js";

import { testUserPassword } from "./variables.js";

faker.seed(123);

export const createPin = (): Readonly<Required<Omit<Pin, "pinOwner" | "removedAt">>> => ({
  pinTitle: faker.lorem.words({ min: 2, max: 5 }),
  pinDescription: faker.commerce.productDescription(),
  photoCloudinaryId: faker.string.alphanumeric({ length: 20, casing: "lower" }),
  photoBlurHash: faker.string.alphanumeric({ length: 28 }),
  photoUrl: faker.image.url(),
  photoWidth: faker.number.int({ min: 200, max: 1000 }),
  photoHeight: faker.number.int({ min: 200, max: 1000 }),
  photoAspectRatio: faker.number.float({ min: 0, max: 0.9, fractionDigits: 2 }),
  photoDescription: faker.food.description(),
  descriptionEmbeddings: faker.helpers.multiple(
    () => faker.number.float({ min: 0, max: 0.9, fractionDigits: 4 }),
    {
      count: 10,
    }
  ),
});

export const createUser = (): Readonly<Required<User>> => ({
  username: faker.string.alphanumeric({ length: 6 }),
  email: faker.internet.email(),
  birthdate: faker.date.birthdate().toISOString(),
  password: testUserPassword,
  salt: faker.string.alphanumeric({ length: 3 }),
  avatarUrl: faker.image.url(),
  avatarCloudinaryId: faker.string.alphanumeric({ length: 20, casing: "lower" }),
});

export const createExpiredMedia = (): Readonly<Required<ExpiredMedia>> => ({
  publicId: faker.string.alphanumeric({ length: 20, casing: "lower" }),
});

export type SeededDB = Readonly<{
  pins: Required<PinDB<Types.ObjectId>[]>;
  users: Required<UserDB[]>;
  expiredMedias: Required<ExpiredMediaDB[]>;
}>;

export const seedDatabase = async (): Promise<SeededDB> => {
  const users = (
    await UserModel.insertMany(faker.helpers.multiple(() => createUser(), { count: 4 }))
  ).map((item) => ({
    ...item.toObject(),
    _id: item._id.toString(),
  })) as unknown as SeededDB["users"];

  const expiredMedias = (
    await ExpiredMediaModel.insertMany([
      ...faker.helpers.multiple(() => createExpiredMedia(), { count: 2 }),
      ...faker.helpers.multiple(
        () => {
          const now = new Date();
          const monthsAgo = faker.number.int({ min: 2, max: 10 });
          return {
            ...createExpiredMedia(),
            createdAt: new Date(now.setMonth(now.getMonth() - monthsAgo)),
          };
        },
        { count: 3 }
      ),
    ])
  ).map((item) => ({
    ...item.toObject(),
    _id: item._id.toString(),
  })) as unknown as SeededDB["expiredMedias"];

  return {
    users,

    expiredMedias,

    pins: (
      await PinModel.insertMany(
        faker.helpers.multiple(
          () =>
            ({
              ...createPin(),
              pinOwner: faker.helpers.arrayElement(users)._id.toString(),
            }) satisfies Pin,
          { count: 10 }
        )
      )
    ).map((item) => ({
      ...item.toObject(),
      _id: item._id.toString(),
    })) as unknown as SeededDB["pins"],
  };
};
