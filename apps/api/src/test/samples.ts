import { faker } from "@faker-js/faker";
import type { Idea, IdeaDB, Pin, PinDB, User, UserDB } from "@repo/types";

import { IdeaModel } from "@/routes/idea/idea.model.js";
import { PinModel } from "@/routes/pin/pin.model.js";
import { UserModel } from "@/routes/user/user.model.js";

import { testUserPassword } from "./variables.js";

faker.seed(123);

export const createPin = (userId: string): Readonly<Required<Pin>> => ({
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

export const createUser = (): Readonly<Required<User>> => {
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

export const createIdea = (userId: string, pinId: string): Readonly<Required<Idea>> => {
  return {
    savedBy: userId,
    pin: pinId,
  };
};

const insertPins = async (userIds: string[]): Promise<SeededDB["pins"]> => {
  const userId = faker.helpers.arrayElement(userIds);
  const newPins = faker.helpers.multiple(() => createPin(userId), { count: 10 });

  const pins = await PinModel.insertMany(newPins);

  const jsonified = pins.map((item) =>
    JSON.parse(JSON.stringify(item.toJSON()))
  ) as SeededDB["pins"];

  return jsonified;
};

const insertUsers = async (): Promise<SeededDB["users"]> => {
  const newUsers = faker.helpers.multiple(() => createUser(), { count: 4 });

  const users = await UserModel.insertMany(newUsers);

  const jsonified = users.map((item) =>
    JSON.parse(JSON.stringify(item.toJSON()))
  ) as SeededDB["users"];

  return jsonified;
};

const insertIdeas = async (userIds: string[], pinIds: string[]): Promise<SeededDB["ideas"]> => {
  const subPinIds = faker.helpers.arrayElements(pinIds, { min: 1, max: pinIds.length - 1 });
  const newIdeas: Idea[] = [];

  for (const u of userIds) {
    for (const p of subPinIds) {
      newIdeas.push(createIdea(u, p));
    }
  }

  const ideas = await IdeaModel.insertMany(faker.helpers.shuffle(newIdeas));

  const jsonified = ideas.map((item) =>
    JSON.parse(JSON.stringify(item.toJSON()))
  ) as SeededDB["ideas"];

  return jsonified;
};

export type SeededDB = Readonly<{
  pins: Required<PinDB[]>;
  users: Required<UserDB[]>;
  ideas: Required<IdeaDB[]>;
}>;

export const seedDatabase = async (): Promise<SeededDB> => {
  const users = await insertUsers();
  const userIds = faker.helpers.shuffle(users.map((u) => u._id));

  const pins = await insertPins(userIds);
  const pinIds = faker.helpers.shuffle(pins.map((p) => p._id));

  const ideas = await insertIdeas(userIds, pinIds);

  return {
    users,
    pins,
    ideas: ideas,
  };
};
