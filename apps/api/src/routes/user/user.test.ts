import type { ValidationError } from "@/constants/schema.constants";
import type { User } from "@/types/model.types";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import createTestClient from "@/helpers/create-test-client";
import { images } from "@/lib/test/variables";

import UserModel from "./user.model";
import * as routes from "./user.routes";

type UserKeys = keyof User;

const users = [
  new UserModel({
    username: "testuser1",
    email: "test@example.com",
    password: "password",
  }),
  new UserModel({
    username: "testuser2",
    email: "test2@example.com",
    password: "password",
  }),
];
const signin = createTestClient(routes.signin);
const register = createTestClient(routes.register);
const updateUserById = createTestClient(routes.updateOneById);
const deleteUserById = createTestClient(routes.deleteOneById);

beforeEach(async () => {
  await UserModel.insertMany(users);
});

describe("User routes", () => {
  describe(`${routes.signin.method.toUpperCase()} ${routes.signin.path}`, () => {
    it("returns a successful response", async () => {
      const res = await signin({ body: { email: "test@example.com", password: "password" } });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeDefined();
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await signin();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns an unauthorized error if payload is invalid", async () => {
      const res = await signin({
        body: {
          email: "invalid",
          password: "a",
        },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(2);
      for (const issue of body?.[0].issues || []) {
        expect(["email", "password"] as UserKeys[]).toContain(issue.path[0]);
      }
    });
  });

  describe(`${routes.register.method.toUpperCase()} ${routes.register.path}`, () => {
    it("returns a validation error if missing required fields", async () => {
      const res = await register();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a conflict error if email is already in use", async () => {
      const res = await register({
        body: { username: "testuser1", email: "test@example.com", password: "password" },
      });

      expect(res.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await register({
        body: {
          username: "testuser1",
          email: "test",
          password: "a",
        },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(2);
      for (const issue of body?.[0].issues || []) {
        expect(["email", "password"] as UserKeys[]).toContain(issue.path[0]);
      }
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await updateUserById({
        params: { id: users[0]._id.toString() },
      })
        .attach("avatar", images[0])
        .field({ email: "updated@example.com" });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("email" as UserKeys);
      expect(res.body.email !== users[0].email).toBe(true);
      expect(res.body).toHaveProperty("avatarUrl" as UserKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await updateUserById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await updateUserById({
        params: { id: "invalid" },
        body: {
          email: "test",
          password: "a",
        },
      });
      const body = res.body as ValidationError | undefined;
      const paths = body?.flatMap((b) => b.issues.flatMap((issue) => issue.path));

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(2);
      for (const path of paths || []) {
        expect(["id", "email", "password"]).toContain(path);
      }
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await updateUserById({
        params: { id: "68d817527719e9421cb63734" },
      }).field({ email: "test@example.com" });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
    it("returns a successful response", async () => {
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toHaveProperty("_id" as UserKeys);
      expect(users[0]).toHaveProperty("email" as UserKeys);
      expect(users[0]).toHaveProperty("password" as UserKeys);

      const res = await deleteUserById({
        params: { id: users[0]._id.toString() },
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const signinRes = await signin({
        body: { email: users[0].email, password: users[0].password },
      });

      expect(signinRes.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await deleteUserById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await deleteUserById({
        params: { id: "invalid" },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(1);
      expect(body?.[0].issues[0].path[0]).toBe("id");
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await deleteUserById({
        params: { id: "68d817527719e9421cb63734" },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
