/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testUserPassword } from "@/test/variables.js";
import { createTestClient } from "@/utils/create-test-client.js";

import * as routes from "./auth.routes.js";
import { requestSchemas } from "./auth.schemas.js";

let db: SeededDB;
const login = createTestClient(routes.login);
const register = createTestClient(routes.register);

describe("Auth routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.login.method.toUpperCase()} ${routes.login.path}`, () => {
    it("returns a successful response", async () => {
      const { email } = db.users[0]!;

      const response = await login().send({
        email,
        password: testUserPassword,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.login.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await login();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.login.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await login().send({
        email: "invalid",
        password: "a",
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.login.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.register.method.toUpperCase()} ${routes.register.path}`, () => {
    it("returns a validation error if missing required fields", async () => {
      const response = await register();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.register.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a conflict error if email is already in use", async () => {
      const user = db.users[0]!;

      const response = await register().send({
        email: user.email,
        password: "password",
        birthdate: "12/09/2000",
      });

      expect(response.status).toBe(HttpStatusCodes.CONFLICT);

      const parseResult = requestSchemas.register.responses[HttpStatusCodes.CONFLICT].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await register().send({
        email: "test",
        password: "a",
        // @ts-expect-error
        birthdate: 2,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.register.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });
});
