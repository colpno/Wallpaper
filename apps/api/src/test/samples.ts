import type { Types } from "mongoose";

import { faker } from "@faker-js/faker";
import type { Pin, PinDB, SavedIdea, SavedIdeaDB, User, UserDB } from "@repo/types";

import { PinModel } from "@/routes/pin/pin.model.js";
import { SavedIdeaModel } from "@/routes/saved-idea/saved-idea.model.js";
import { UserModel } from "@/routes/user/user.model.js";

import { testUserPassword } from "./variables.js";

faker.seed(123);

const createPin = (userId: string): Readonly<Required<Pin>> => ({
  pinTitle: faker.lorem.words({ min: 2, max: 5 }),
  pinDescription: faker.commerce.productDescription(),
  pinOwner: userId,
  photoCloudinaryId: faker.string.alphanumeric({ length: 20, casing: "lower" }),
  photoBlurHash: faker.string.alphanumeric({ length: 28 }),
  photoUrl: faker.image.url(),
  photoWidth: faker.number.int({ min: 200, max: 1000 }),
  photoHeight: faker.number.int({ min: 200, max: 1000 }),
  photoAspectRatio: faker.number.float({ min: 0, max: 0.9, fractionDigits: 2 }),
  photoDescription: faker.food.description(),
  descriptionEmbeddings: faker.helpers.multiple(
    () => faker.number.float({ min: 0, max: 0.9, fractionDigits: 4 }),
    { count: 10 }
  ),
});

const createUser = (): Readonly<Required<User>> => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    username: `${firstName}${lastName}`,
    email: faker.internet.email(),
    birthdate: faker.date.birthdate().toISOString(),
    password: testUserPassword,
    salt: faker.string.alphanumeric({ length: 3 }),
    avatarUrl: faker.image.url(),
    avatarCloudinaryId: faker.string.alphanumeric({ length: 20, casing: "lower" }),
  };
};

const createSavedIdea = (userId: string, pinId: string): Readonly<Required<SavedIdea>> => {
  return {
    savedBy: userId,
    pin: pinId,
  };
};

const insertPins = async (userIds: string[]): Promise<SeededDB["pins"]> => {
  const userId = faker.helpers.arrayElement(userIds);
  const newPins = faker.helpers.multiple(() => createPin(userId), { count: 10 });

  const pins = await PinModel.insertMany(newPins);

  const jsonified = pins.map((item) => ({
    ...item.toJSON(),
    _id: item._id.toString(),
  })) as SeededDB["pins"];

  return jsonified;
};

const insertUsers = async (): Promise<SeededDB["users"]> => {
  const newUsers = faker.helpers.multiple(() => createUser(), { count: 4 });

  const users = await UserModel.insertMany(newUsers);

  const jsonified = users.map((item) => ({
    ...item.toJSON(),
    _id: item._id.toString(),
    birthdate: item.birthdate,
  })) as SeededDB["users"];

  return jsonified;
};

const insertSavedIdeas = async (
  userIds: string[],
  pinIds: string[]
): Promise<SeededDB["savedIdeas"]> => {
  const subPinIds = faker.helpers.arrayElements(pinIds, { min: 1, max: pinIds.length - 1 });
  const newSavedIdeas: SavedIdea[] = [];

  for (const u of userIds) {
    for (const p of subPinIds) {
      newSavedIdeas.push(createSavedIdea(u, p));
    }
  }

  const savedIdeas = await SavedIdeaModel.insertMany(faker.helpers.shuffle(newSavedIdeas));

  const jsonified = savedIdeas.map((item) => ({
    ...item.toJSON(),
    _id: item._id.toString(),
    savedBy: item.savedBy.toString(),
    pin: item.pin.toString(),
  })) as SeededDB["savedIdeas"];

  return jsonified;
};

export type SeededDB = Readonly<{
  pins: Required<PinDB<Types.ObjectId>[]>;
  users: Required<UserDB[]>;
  savedIdeas: Required<SavedIdeaDB[]>;
}>;

export const seedDatabase = async (): Promise<SeededDB> => {
  const users = await insertUsers();
  const userIds = faker.helpers.shuffle(users.map((u) => u._id));

  const pins = await insertPins(userIds);
  const pinIds = faker.helpers.shuffle(pins.map((p) => p._id));

  const savedIdeas = await insertSavedIdeas(userIds, pinIds);

  return {
    users,
    pins,
    savedIdeas,
  };
};
