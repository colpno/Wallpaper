/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { PostKeys, UserKeys } from "@/types/common.js";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import { seedDatabase, type SeededDB } from "@/test/samples.js";
import { testImages } from "@/test/variables.js";
import createTestClient from "@/utils/create-test-client.js";
import { type ValidationError, validationErrorSchema } from "@/utils/schemas.js";

import * as routes from "./post.routes.js";

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
      const res = await getPostById({ id: db.posts[0]!._id });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeDefined();
    });

    it("returns a post with stripped properties", async () => {
      const res = await getPostById({ id: db.posts[0]!._id }).query({
        select: {
          _id: 0,
          postTitle: 1,
          postOwner: 1,
        },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(Object.keys(res.body).length).toBe(2);
      expect(res.body).toHaveProperty("postTitle" as PostKeys);
      expect(res.body).toHaveProperty("postOwner" as PostKeys);
    });

    it("returns a post with populated fields", async () => {
      const res = await getPostById({ id: db.posts[0]!._id }).query({ embed: "postOwner" });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("postOwner" as PostKeys);
      expect(typeof res.body.postOwner).toBe("object");
      expect(res.body.postOwner).toHaveProperty("email" as UserKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await getPostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await getPostById({ id: "invalid-id" }).query({
        select: {
          // @ts-expect-error
          photoHeight: "invalid-select",
        },
      });

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await getPostById({ id: "68d817527719e9421cb63734" });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("Returns filtered posts", async () => {
      const postOwnerId = db.users[0]!._id.toString();

      const res = await getPosts().query({
        postOwner: postOwnerId,
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("postOwner" as PostKeys, postOwnerId);
    });

    it("returns a list of posts with stripped properties", async () => {
      const res = await getPosts().query({
        select: {
          _id: 0,
          postOwner: 1,
          postTitle: 1,
        },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      for (const img of res.body) {
        expect(Object.keys(img).length).toBe(2);
        expect(img).toHaveProperty("postOwner" as PostKeys);
        expect(img).toHaveProperty("postTitle" as PostKeys);
      }
    });

    it("returns a paginated list of db.posts", async () => {
      const res = await getPosts().query({
        page: 1,
        limit: 1,
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
    });

    it("returns a sorted list of db.posts", async () => {
      const res = await getPosts().query({
        sort: {
          photoWidth: "asc",
        },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(1);
      for (let i = 1; i < res.body.length; i++) {
        expect(res.body[i - 1].photoWidth <= res.body[i].photoWidth).toBe(true);
      }
    });

    it("returns a list of db.posts with populated fields", async () => {
      const res = await getPosts().query({
        embed: "postOwner",
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(1);
      for (const post of res.body) {
        expect(post).toHaveProperty("postOwner" as PostKeys);
        expect(typeof post.postOwner).toBe("object");
        expect(post.postOwner).toHaveProperty("email" as UserKeys);
      }
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await getPosts().query({
        limit: -5,
        // @ts-expect-error
        page: "invalid",
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(2);
      for (const issue of body?.[0]!.issues || []) {
        expect(["limit", "page"]).toContain(issue.path[0]);
      }
    });
  });

  describe(`${routes.addOne.method.toUpperCase()} ${routes.addOne.path}`, () => {
    it("returns a validation error if missing required fields", async () => {
      const res = await addPost()
        // @ts-expect-error
        .field({
          postOwner: db.users[0]!._id.toString(),
        })
        .attach("photo", testImages[0]!);

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const res = await addPost()
        .field({
          postTitle: "New Post",
          postDescription: "This is a new post.",
          // @ts-expect-error
          postOwner: 12345,
        })
        .attach("photo", testImages[0]!);
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(1);
      for (const issue of body?.[0]!.issues || []) {
        expect(["postOwner"] as PostKeys[]).toContain(issue.path[0]);
      }
    });

    it("returns a post without extra field", async () => {
      const res = await addPost()
        .field({
          postTitle: "New Post",
          postOwner: db.users[0]!._id.toString(),
          postDescription: "This is a new post.",
          // @ts-expect-error
          extraField: "extra",
        })
        .attach("photo", testImages[0]!);

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body).not.toHaveProperty("extraField");
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await updatePostById({ id: db.posts[0]!._id }).send({
        postTitle: "Updated Test Post",
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("postTitle" as PostKeys, "Updated Test Post");
      expect(res.body.postTitle !== db.posts[0]!.postTitle).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await updatePostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const res = await updatePostById({ id: "invalid-id" }).send(
        // @ts-expect-error
        { postTitle: 12345 }
      );
      const { success, data } = validationErrorSchema.safeParse(res.body);

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(success).toBeTruthy();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      for (const item of data || []) {
        expect(["id", "postTitle"] as PostKeys[]).toContain(item.issues[0]!.path[0]);
      }
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await updatePostById({ id: "68d817527719e9421cb63734" }).send({
        postTitle: "Updated Title",
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.removeOneById.method.toUpperCase()} ${routes.removeOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await removePostById({ id: db.posts[0]!._id });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getRes = await getPostById({ id: db.posts[0]!._id });

      expect(getRes.body).toHaveProperty("removedAt" as PostKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await removePostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await removePostById({ id: "invalid" });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(1);
      expect(body?.[0]!.issues[0]!.path[0]).toBe("id");
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await removePostById({ id: "68d817527719e9421cb63734" });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.removeMany.method.toUpperCase()} ${routes.removeMany.path}`, () => {
    it("returns a successful response", async () => {
      const res = await removePosts().send({
        ids: db.posts.slice(0, 2).map((post) => post._id),
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getRes1 = await getPostById({ id: db.posts[0]!._id });
      const getRes2 = await getPostById({ id: db.posts[1]!._id });

      expect(getRes1.body).toHaveProperty("removedAt" as PostKeys);
      expect(getRes2.body).toHaveProperty("removedAt" as PostKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await removePosts();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await removePosts().send({
        ids: ["invalid-id"],
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0]!.issues).toHaveLength(1);
      expect(body?.[0]!.issues[0]!.path[0]).toBe("ids");
    });

    it("returns a not found error if none of the ids belong to any", async () => {
      const res = await removePosts().send({
        ids: ["68d817527719e9421cb63734", "68d817527719e9421cb63735"],
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
