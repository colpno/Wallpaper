import type { UserKeys } from "@/types/common.js";
import type { ValidationError } from "@/utils/schemas.js";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testUserPassword } from "@/test/variables.js";
import createTestClient from "@/utils/create-test-client.js";

import * as routes from "./auth.routes.js";

let db: SeededDB;
const signin = createTestClient(routes.signin);
const register = createTestClient(routes.register);

describe("Auth routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.signin.method.toUpperCase()} ${routes.signin.path}`, () => {
    it("returns a successful response", async () => {
      const { email } = db.users[0]!;

      const res = await signin().send({
        email,
        password: testUserPassword,
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeDefined();
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await signin();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns an unauthorized error if payload is invalid", async () => {
      const res = await signin().send({
        email: "invalid",
        password: "a",
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(2);
      for (const issue of body?.[0]!.issues || []) {
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
      const { email } = db.users[0]!;

      const res = await register().send({
        username: "testuser1",
        email,
        password: "password",
      });

      expect(res.status).toBe(HttpStatusCodes.CONFLICT);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await register().send({
        username: "testuser1",
        email: "test",
        password: "a",
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(2);
      for (const issue of body?.[0]!.issues || []) {
        expect(["email", "password"] as UserKeys[]).toContain(issue.path[0]);
      }
    });
  });
});
