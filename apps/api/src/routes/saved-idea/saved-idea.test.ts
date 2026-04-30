/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpStatusCodes } from "@repo/shared";
import type { PinDB, SavedIdeaDB } from "@repo/types";
import { beforeEach, describe, expect, it } from "vitest";
import z from "zod";

import { createPin, seedDatabase, type SeededDB } from "@/test/samples.js";
import { createTestClient } from "@/utils/create-test-client.js";
import { paginationPayloadSchema } from "@/utils/schemas.js";

import { PinModel } from "../pin/pin.model.js";
import { userSchema } from "../user/user.schemas.js";
import { SavedIdeaModel } from "./saved-idea.model.js";
import * as routes from "./saved-idea.routes.js";
import { requestSchemas, savedIdeaSchema } from "./saved-idea.schemas.js";

let db: SeededDB;
const getIdeas = createTestClient(routes.getMany);
const checkSaved = createTestClient(routes.checkSaved);
const addSavedIdea = createTestClient(routes.addOne);
const deleteSavedIdeaById = createTestClient(routes.deleteOneById);

describe("Saved idea routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("returns filtered items", async () => {
      const pinOwnerId = db.users[0]!._id;

      const response = await getIdeas().query({
        savedBy: pinOwnerId,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(savedIdeaSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      for (const pin of parseResult.data!) {
        expect(pin.savedBy).toBe(pinOwnerId);
      }
    });

    it("returns a list of items with stripped properties", async () => {
      const response = await getIdeas().query({
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

    it("returns a paginated list of items", async () => {
      const page = 1;
      const limit = 1;

      const response = await getIdeas().query({ page, limit });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = paginationPayloadSchema(z.array(savedIdeaSchema)).safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.meta.currentPage).toBe(page);
      expect(parseResult.data!.meta.itemsPerPage).toBe(limit);
    });

    it("returns a sorted list of items", async () => {
      const response = await getIdeas().query({
        sort: {
          updatedAt: "asc",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(savedIdeaSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.length).toBeGreaterThan(0);
      if (parseResult.data && parseResult.data.length > 1) {
        for (let i = 1; i < parseResult.data.length; i++) {
          expect(parseResult.data[i - 1]!.updatedAt <= parseResult.data[i]!.updatedAt).toBe(true);
        }
      }
    });

    it("returns a list of items with populated fields", async () => {
      const embedKey: keyof SavedIdeaDB = "savedBy";

      const response = await getIdeas().query({
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
      const response = await getIdeas().query({
        limit: -5,
        // @ts-expect-error
        page: "invalid",
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
      const newPin: PinDB = JSON.parse(
        JSON.stringify((await PinModel.create(createPin(db.users[1]!._id))).toJSON<PinDB>())
      );

      const response = await addSavedIdea().send({
        savedBy: db.users[0]!._id,
        pin: newPin._id,
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

      const newPin: PinDB = JSON.parse(
        JSON.stringify((await PinModel.create(createPin(db.users[1]!._id))).toJSON<PinDB>())
      );

      const response = await addSavedIdea().send({
        savedBy: db.users[0]!._id,
        pin: newPin._id,
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

  describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
    it("returns a successful response", async () => {
      const savedIdea = db.savedIdeas[0]!;

      const deleteSavedIdeaResponse = await deleteSavedIdeaById({ id: savedIdea._id });

      expect(deleteSavedIdeaResponse.status).toBe(HttpStatusCodes.NO_CONTENT);

      const ideas = await SavedIdeaModel.findById(savedIdea._id);

      expect(ideas).toBe(null);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await deleteSavedIdeaById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await deleteSavedIdeaById({ id: "invalid" });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await deleteSavedIdeaById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });
});
