/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpStatusCodes } from "@repo/shared";
import type { SavedIdeaAPIs } from "@repo/types";
import { beforeEach, describe, expect, it } from "vitest";
import z from "zod";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { createTestClient } from "@/utils/create-test-client.js";

import { userSchema } from "../user/user.schemas.js";
import * as routes from "./saved-idea.routes.js";
import { requestSchemas, savedIdeaSchema } from "./saved-idea.schemas.js";

let db: SeededDB;
const getSavedIdeas = createTestClient(routes.getMany);
const checkSaved = createTestClient(routes.checkSaved);
const addSavedIdea = createTestClient(routes.addOne);

describe("Saved idea routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("Returns a filtered list", async () => {
      const userId = db.savedIdeas[0]!.savedBy;

      const response = await getSavedIdeas().query({
        userId,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(savedIdeaSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      for (const savedIdea of parseResult.data!) {
        expect(savedIdea.savedBy).toBe(userId);
      }
    });

    it("returns a list with stripped properties", async () => {
      const response = await getSavedIdeas().query({
        userId: db.users[0]!._id,
        select: {
          _id: 0,
          savedBy: 1,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          savedIdeaSchema.pick({
            savedBy: true,
          })
        )
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a list with populated fields", async () => {
      const embedKey: SavedIdeaAPIs.EmbeddableFields = "savedBy";

      const response = await getSavedIdeas().query({
        userId: db.users[0]!._id,
        embed: embedKey,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          savedIdeaSchema
            .omit({
              [embedKey]: true,
            })
            .extend({
              [embedKey]: userSchema,
            })
        )
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await getSavedIdeas().query({
        // @ts-expect-error
        userId: 123,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.getMany.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.checkSaved.method.toUpperCase()} ${routes.checkSaved.path}`, () => {
    it("returns saved result if pin exists", async () => {
      const response = await checkSaved().query({
        userId: db.savedIdeas[0]!.savedBy,
        pinId: db.savedIdeas[0]!.pin,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.checkSaved.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data?.saved).toBe(true);
    });

    it("returns not saved result if does not exist", async () => {
      const response = await checkSaved().query({
        userId: db.savedIdeas[0]!.savedBy,
        pinId: "68d817527719e9421cb63734",
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.checkSaved.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data?.saved).toBe(false);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await checkSaved();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.checkSaved.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await checkSaved().query({
        // @ts-expect-error
        userId: 23,
        // @ts-expect-error
        pinId: true,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.checkSaved.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.addOne.method.toUpperCase()} ${routes.addOne.path}`, () => {
    it("returns a successful response", async () => {
      const response = await addSavedIdea().send({
        savedBy: db.users[0]!._id,
        pin: db.pins[0]!._id,
      });

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const parseResult = requestSchemas.addOne.responses[HttpStatusCodes.CREATED].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await addSavedIdea()
        // @ts-expect-error
        .send({
          savedBy: db.users[0]!._id,
        });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.addOne.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const response = await addSavedIdea().send({
        // @ts-expect-error
        savedBy: 12345,
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.addOne.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns an item without extra field", async () => {
      const extraKey: string = "extraField";

      const response = await addSavedIdea().send({
        savedBy: db.users[0]!._id,
        pin: db.pins[0]!._id,
        [extraKey]: "extra",
      });

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const parseResult = requestSchemas.addOne.responses[HttpStatusCodes.CREATED].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data).not.toHaveProperty(extraKey);
    });
  });
});
