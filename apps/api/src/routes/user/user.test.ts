import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testImages } from "@/test/variables.js";
import createTestClient from "@/utils/create-test-client.js";

import { signin as signinRouteConfig } from "../auth/auth.routes.js";
import * as routes from "./user.routes.js";
import { requestSchemas } from "./user.schemas.js";

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
      const oldUser = db.users[0]!;

      const response = await updateUserById({ id: oldUser._id })
        .field({ email: "updated@example.com" })
        .attach("avatar", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.updateOneById.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data?.email !== oldUser.email).toBe(true);
      expect(parseResult.data?.avatarUrl !== oldUser.avatarUrl).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await updateUserById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await updateUserById({ id: "invalid" }).send({
        email: "test",
        password: "a",
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await updateUserById({ id: "68d817527719e9421cb63734" }).send({
        email: "test@example.com",
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
    it("returns a successful response", async () => {
      const user = db.users[0]!;

      const deleteResponse = await deleteUserById({ id: user._id });

      expect(deleteResponse.status).toBe(HttpStatusCodes.NO_CONTENT);

      const signinResponse = await signin().send({
        email: user.email,
        password: user.password,
      });

      expect(signinResponse.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await deleteUserById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await deleteUserById({ id: "invalid" });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await deleteUserById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });
});
