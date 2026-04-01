/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PostKeys } from "@/types/common.js";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";
import z from "zod";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testImages } from "@/test/variables.js";
import createTestClient from "@/utils/create-test-client.js";
import { paginationPayloadSchema } from "@/utils/schemas.js";

import { userSchema } from "../user/user.schemas.js";
import * as routes from "./post.routes.js";
import { postSchema, requestSchemas } from "./post.schemas.js";

let db: SeededDB;
const getPostById = createTestClient(routes.getOneById);
const getPosts = createTestClient(routes.getMany);
const addPost = createTestClient(routes.addOne);
const updatePostById = createTestClient(routes.updateOneById);
const removePostById = createTestClient(routes.removeOneById);
const removePosts = createTestClient(routes.removeMany);

describe("Post routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();
  });

  describe(`${routes.getOneById.method.toUpperCase()} ${routes.getOneById.path}`, () => {
    it("returns a successful response", async () => {
      const response = await getPostById({ id: db.posts[0]!._id });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });

    it("returns a post with stripped properties", async () => {
      const stripKeys: PostKeys[] = ["postTitle", "postOwner"];

      const response = await getPostById({ id: db.posts[0]!._id }).query({
        select: {
          _id: 0,
          ...Object.fromEntries(stripKeys.map((key) => [key, 1])),
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK]
        .pick(Object.fromEntries(stripKeys.map((key) => [key, true])))
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a post with populated fields", async () => {
      const embedKey: PostKeys = "postOwner";

      const response = await getPostById({ id: db.posts[0]!._id }).query({ embed: embedKey });

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
      const response = await getPostById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.getOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await getPostById({ id: "invalid-id" }).query({
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
      const response = await getPostById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.NOT_FOUND].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("Returns filtered posts", async () => {
      const postOwnerId = db.users[0]!._id;

      const response = await getPosts().query({
        postOwner: postOwnerId,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(postSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      for (const post of parseResult.data!) {
        expect(post.postOwner).toBe(postOwnerId);
      }
    });

    it("returns a list of posts with stripped properties", async () => {
      const stripKeys: PostKeys[] = ["postOwner", "postTitle"];

      const response = await getPosts().query({
        select: {
          _id: 0,
          ...Object.fromEntries(stripKeys.map((key) => [key, 1])),
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(postSchema.pick(Object.fromEntries(stripKeys.map((key) => [key, true]))))
        .safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a paginated list of posts", async () => {
      const page = 1;
      const limit = 1;

      const response = await getPosts().query({ page, limit });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = paginationPayloadSchema(z.array(postSchema)).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.meta.currentPage).toBe(page);
      expect(parseResult.data!.meta.itemsPerPage).toBe(limit);
    });

    it("returns a sorted list of posts", async () => {
      const response = await getPosts().query({
        sort: {
          photoWidth: "asc",
        },
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(postSchema).safeParse(response.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data!.length).toBeGreaterThan(0);
      if (parseResult.data && parseResult.data.length > 1) {
        for (let i = 1; i < parseResult.data.length; i++) {
          expect(parseResult.data[i - 1]!.photoWidth <= parseResult.data[i]!.photoWidth).toBe(true);
        }
      }
    });

    it("returns a list of posts with populated fields", async () => {
      const embedKey: PostKeys = "postOwner";

      const response = await getPosts().query({
        embed: embedKey,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = z
        .array(
          postSchema
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
      const response = await getPosts().query({
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

  describe(`${routes.addOne.method.toUpperCase()} ${routes.addOne.path}`, () => {
    it("returns a successful response", async () => {
      const response = await addPost()
        .field({
          postTitle: "New Post",
          postDescription: "New post description",
          postOwner: db.users[0]!._id,
          photoBlurHash: "some-random-string",
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
      const response = await addPost()
        // @ts-expect-error
        .field({
          postOwner: db.users[0]!._id,
        })
        .attach("photo", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.addOne.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const response = await addPost()
        .field({
          postTitle: "New Post",
          postDescription: "This is a new post.",
          // @ts-expect-error
          postOwner: 12345,
        })
        .attach("photo", testImages[0]!);

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.addOne.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a post without extra field", async () => {
      const extraKey: string = "extraField";

      const response = await addPost()
        .field({
          postTitle: "New Post",
          postOwner: db.users[0]!._id,
          postDescription: "This is a new post.",
          photoBlurHash: "New blur hash",
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
      const oldPost = db.posts[0]!;
      const newTitle = "Updated Test Post";

      const response = await updatePostById({ id: oldPost._id }).send({
        postTitle: newTitle,
      });

      expect(response.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.updateOneById.responses[HttpStatusCodes.OK].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data).toHaveProperty("postTitle" as PostKeys, newTitle);
      expect(parseResult.data!.postTitle !== oldPost.postTitle).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await updatePostById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await updatePostById({ id: "invalid-id" }).send(
        // @ts-expect-error
        { postTitle: 12345 }
      );

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBeTruthy();
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await updatePostById({ id: "68d817527719e9421cb63734" }).send({
        postTitle: "Updated Title",
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.updateOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.removeOneById.method.toUpperCase()} ${routes.removeOneById.path}`, () => {
    it("returns a successful response", async () => {
      const removePostResponse = await removePostById({ id: db.posts[0]!._id });

      expect(removePostResponse.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getPostResponse = await getPostById({ id: db.posts[0]!._id });

      expect(getPostResponse.status).toBe(HttpStatusCodes.OK);

      const parseResult = requestSchemas.getOneById.responses[HttpStatusCodes.OK].safeParse(
        getPostResponse.body
      );

      expect(parseResult.success).toBe(true);
      expect(parseResult.data?.removedAt).toBeDefined();
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await removePostById();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.removeOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await removePostById({ id: "invalid" });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.removeOneById.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const response = await removePostById({ id: "68d817527719e9421cb63734" });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.removeOneById.responses[
        HttpStatusCodes.NOT_FOUND
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });
  });

  describe(`${routes.removeMany.method.toUpperCase()} ${routes.removeMany.path}`, () => {
    it("returns a successful response", async () => {
      const ids = db.posts.slice(0, 2).map((post) => post._id);

      const removePostsResponse = await removePosts().send({ ids });

      expect(removePostsResponse.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getPostsResponse = await getPosts().query({ _id: { in: ids } });

      expect(getPostsResponse.status).toBe(HttpStatusCodes.OK);

      const parseResult = z.array(postSchema).safeParse(getPostsResponse.body);

      expect(parseResult.success).toBe(true);
      expect(parseResult.data?.length).toBe(ids.length);
      for (const post of parseResult.data ?? []) {
        expect(post.removedAt).toBeDefined();
      }
    });

    it("returns a validation error if missing required fields", async () => {
      const response = await removePosts();

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.removeMany.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a validation error if payload is invalid", async () => {
      const response = await removePosts().send({
        ids: ["invalid-id"],
      });

      expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);

      const parseResult = requestSchemas.removeMany.responses[
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      ].safeParse(response.body);

      expect(parseResult.success).toBe(true);
    });

    it("returns a not found error if none of the ids belong to any", async () => {
      const response = await removePosts().send({
        ids: ["68d817527719e9421cb63734", "68d817527719e9421cb63735"],
      });

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);

      const parseResult = requestSchemas.removeMany.responses[HttpStatusCodes.NOT_FOUND].safeParse(
        response.body
      );

      expect(parseResult.success).toBe(true);
    });
  });
});
