import type { UserKeys } from "@/types/common.js";
import type { ValidationError } from "@/utils/schemas.js";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testImages } from "@/test/variables.js";
import createTestClient from "@/utils/create-test-client.js";

import { signin as signinRouteConfig } from "../auth/auth.routes.js";
import * as routes from "./user.routes.js";

let db: SeededDB;
const updateUserById = createTestClient(routes.updateOneById);
const deleteUserById = createTestClient(routes.deleteOneById);
const signin = createTestClient(signinRouteConfig);

describe("User routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await updateUserById({ id: db.users[0]!._id.toString() })
        .field({ email: "updated@example.com" })
        .attach("avatar", testImages[0]!);

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("email" as UserKeys);
      expect(res.body.email !== db.users[0]!.email).toBe(true);
      expect(res.body).toHaveProperty("avatarUrl" as UserKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await updateUserById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await updateUserById({ id: "invalid" }).send({
        email: "test",
        password: "a",
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
      const res = await updateUserById({ id: "68d817527719e9421cb63734" }).send({
        email: "test@example.com",
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await deleteUserById({ id: db.users[0]!._id.toString() });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const signinRes = await signin().send({
        email: db.users[0]!.email,
        password: db.users[0]!.password,
      });

      expect(signinRes.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await deleteUserById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await deleteUserById({ id: "invalid" });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(1);
      expect(body?.[0]!.issues[0]!.path[0]).toBe("id");
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await deleteUserById({ id: "68d817527719e9421cb63734" });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
