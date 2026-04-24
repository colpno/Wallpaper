/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PinKeys } from "@/types/common.js";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";
import z from "zod";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testImages } from "@/test/variables.js";
import { createTestClient } from "@/utils/create-test-client.js";
import { paginationPayloadSchema } from "@/utils/schemas.js";

import { userSchema } from "../user/user.schemas.js";
import * as routes from "./pin.routes.js";
import { pinSchema, requestSchemas } from "./pin.schemas.js";

let db: SeededDB;
const getPins = createTestClient(routes.getMany);
const getPinsWithSaves = createTestClient(routes.getManyWithSaves);
const getPinById = createTestClient(routes.getOneById);
const addPin = createTestClient(routes.addOne);
const updatePinById = createTestClient(routes.updateOneById);
const deletePinById = createTestClient(routes.deleteOneById);

describe("Pin routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("returns filtered pins", async () => {
      const pinOwnerId = db.users[0]!._id;

      const response = await getPins().query({
        pinOwner: pinOwnerId,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(pinSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      for (const pin of parseResult.data!) {
        expect(pin.pinOwner).toBe(pinOwnerId);
      }
    });

    it("returns a list of pins with stripped properties", async () => {
      const response = await getPins().query({
        select: {
          _id: 0,
          pinTitle: 1,
          pinOwner: 1,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          pinSchema.pick({
            pinTitle: true,
            pinOwner: true,
          })
        )
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a paginated list of pins", async () => {
      const page = 1;
      const limit = 1;

      const response = await getPins().query({ page, limit });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = paginationPayloadSchema(z.array(pinSchema)).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.meta.currentPage).toBe(page);
      expect(parseResult.data!.meta.itemsPerPage).toBe(limit);
    });

    it("returns a sorted list of pins", async () => {
      const response = await getPins().query({
        sort: {
          photoWidth: "asc",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(pinSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.length).toBeGreaterThan(0);
      if (parseResult.data && parseResult.data.length > 1) {
        for (let i = 1; i < parseResult.data.length; i++) {
          expect(parseResult.data[i - 1]!.photoWidth <= parseResult.data[i]!.photoWidth).toBe(true);
        }
      }
    });

    it("returns a list of pins with populated fields", async () => {
      const embedKey: PinKeys = "pinOwner";

      const response = await getPins().query({
        embed: embedKey,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          pinSchema
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
      const response = await getPins().query({
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

  describe(`${routes.getManyWithSaves.method.toUpperCase()} ${routes.getManyWithSaves.path}`, () => {
    it("returns a successful response", async () => {
      const pinOwnerId = db.users[0]!._id;

      const response = await getPinsWithSaves().query({
        pinOwner: pinOwnerId,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(pinSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a list of pins with stripped properties", async () => {
      const response = await getPinsWithSaves().query({
        pinOwner: db.users[0]!._id,
        select: {
          _id: 0,
          pinTitle: 1,
          pinOwner: 1,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          pinSchema.pick({
            pinTitle: true,
            pinOwner: true,
          })
        )
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a paginated list of pins", async () => {
      const page = 1;
      const limit = 1;

      const response = await getPinsWithSaves().query({
        pinOwner: db.users[0]!._id,
        page,
        limit,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = paginationPayloadSchema(z.array(pinSchema)).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.meta.currentPage).toBe(page);
      expect(parseResult.data!.meta.itemsPerPage).toBe(limit);
    });

    it("returns a sorted list of pins", async () => {
      const response = await getPinsWithSaves().query({
        pinOwner: db.users[0]!._id,
        sort: {
          photoWidth: "asc",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(pinSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.length).toBeGreaterThan(0);
      if (parseResult.data && parseResult.data.length > 1) {
        for (let i = 1; i < parseResult.data.length; i++) {
          expect(parseResult.data[i - 1]!.photoWidth <= parseResult.data[i]!.photoWidth).toBe(true);
        }
      }
    });

    it("returns a list of pins with populated fields", async () => {
      const embedKey: PinKeys = "pinOwner";

      const response = await getPinsWithSaves().query({
        pinOwner: db.users[0]!._id,
        embed: embedKey,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          pinSchema
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
      const response = await getPinsWithSaves().query({
        limit: -5,
        // @ts-expect-error
        page: "invalid",
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.getManyWithSaves.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.getOneById.method.toUpperCase()} ${routes.getOneById.path}`, () => {
    it("returns a successful response", async () => {
      const response = await getPinById({ id: db.pins[0]!._id });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a pin with stripped properties", async () => {
      const response = await getPinById({ id: db.pins[0]!._id }).query({
        select: {
          _id: 0,
          pinTitle: 1,
          pinOwner: 1,
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK]
        .pick({
          pinTitle: true,
          pinOwner: true,
        })
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a pin with populated fields", async () => {
      const embedKey: PinKeys = "pinOwner";

      const response = await getPinById({ id: db.pins[0]!._id }).query({ embed: embedKey });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK]
        .omit({
          [embedKey]: true,
        })
        .extend({
          [embedKey]: userSchema,
        })
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await getPinById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.getOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await getPinById({ id: "invalid-id" }).query({
        select: {
          // @ts-expect-error
          photoHeight: "invalid-select",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.getOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await getPinById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.NOT_FOUND].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.addOne.method.toUpperCase()} ${routes.addOne.path}`, () => {
    it("returns a successful response", async () => {
      const response = await addPin()
        .field({
          pinTitle: "New Pin",
          pinDescription: "New pin description",
          pinOwner: db.users[0]!._id,
          photo: "no-value",
        })
        .attach("photo", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const parseResult = requestSchemas.addOne.responses[HttpStatusCodes.CREATED].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await addPin()
        // @ts-expect-error
        .field({
          pinOwner: db.users[0]!._id,
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

      const response = await addPin()
        .field({
          pinTitle: "New Pin",
          pinDescription: "This is a new pin.",
          // @ts-expect-error
          pinOwner: 12345,
        })
        .attach("photo", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.addOne.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a pin without extra field", async () => {
      const extraKey: string = "extraField";

      const response = await addPin()
        .field({
          pinTitle: "New Pin",
          pinOwner: db.users[0]!._id,
          pinDescription: "This is a new pin.",
          photo: "no-value",
          [extraKey]: "extra",
        })
        .attach("photo", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.CREATED);

      const parseResult = requestSchemas.addOne.responses[HttpStatusCodes.CREATED].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data).not.toHaveProperty(extraKey);
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      const oldPin = db.pins[0]!;
      const newTitle = "Updated Test Pin";

      const response = await updatePinById({ id: oldPin._id }).send({
        pinTitle: newTitle,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.updateOneById.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data).toHaveProperty("pinTitle" as PinKeys, newTitle);
      expect(parseResult.data!.pinTitle !== oldPin.pinTitle).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await updatePinById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await updatePinById({ id: "invalid-id" }).send(
        // @ts-expect-error
        { pinTitle: 12345 }
      );

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBeTruthy();
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await updatePinById({ id: "68d817527719e9421cb63734" }).send({
        pinTitle: "Updated Title",
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
      const pin = db.pins[0]!;

      const deletePinResponse = await deletePinById({ id: pin._id });

      expect(deletePinResponse.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getPinResponse = await getPinById({ id: pin._id });

      expect(getPinResponse.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.NOT_FOUND].safeParse(
        getPinResponse.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await deletePinById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await deletePinById({ id: "invalid" });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await deletePinById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.deleteOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });
});
