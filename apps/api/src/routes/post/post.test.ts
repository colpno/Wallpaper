/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ValidationError } from "@/constants/schema.constants";
import type { ObjectIdToString } from "mongoose";

import { HttpStatusCodes, Types } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import createTestClient from "@/helpers/create-test-client";
import { addPost, updatePostById } from "@/lib/test/helpers";
import { images } from "@/lib/test/variables";

import UserModel from "../user/user.model";
import * as routes from "./post.routes";

const users = [
  new UserModel({
    email: "test@example.com",
    password: "password",
    username: "testuser1",
  }),
  new UserModel({
    email: "test2@example.com",
    password: "password",
    username: "testuser2",
  }),
];
let posts: ObjectIdToString<Types.Post>[] = [];
const getPostById = createTestClient(routes.getOneById);
const getPosts = createTestClient(routes.getMany);
const removePostById = createTestClient(routes.removeOneById);
const removePosts = createTestClient(routes.removeMany);

beforeEach(async () => {
  await UserModel.insertMany(users);

  const responses = [
    await addPost({
      photo: images[0],
      postTitle: "Test Post",
      postDescription: "This is a test post.",
      postOwner: users[0]._id.toString(),
      photoBlurHash: "LKO2?U%2Tw=ay~pofayay00ofayay",
    }),
    await addPost({
      photo: images[1],
      postTitle: "Another Test Post",
      postDescription: "This is another test post.",
      postOwner: users[1]._id.toString(),
      photoBlurHash: "LKO2?U%2Tw=ay~pofayay00ofayay",
    }),
  ];
  const errors = responses
    .filter((res) => res.status !== HttpStatusCodes.CREATED)
    .map((res) => res.text);
  if (errors.length > 0) {
    errors.forEach((e) => console.error(e));
    throw new Error("Failed to create test posts");
  }
  posts = responses.map((res) => res.body);
});

describe("Post routes", () => {
  describe(`${routes.getOneById.method.toUpperCase()} ${routes.getOneById.path}`, () => {
    it("returns a successful response", async () => {
      const res = await getPostById({
        params: { id: posts[0]._id },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toBeDefined();
    });

    it("returns a post with stripped properties", async () => {
      const res = await getPostById({
        params: { id: posts[0]._id },
        query: { select: ["postTitle", "postOwner"] },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(Object.keys(res.body).length).toBe(3); // including _id by default
      expect(res.body).toHaveProperty("postTitle" as Types.PostKeys);
      expect(res.body).toHaveProperty("postOwner" as Types.PostKeys);
    });

    it("returns a post with populated fields", async () => {
      const res = await getPostById({
        params: { id: posts[0]._id },
        query: { embed: "postOwner" },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("postOwner" as Types.PostKeys);
      expect(typeof res.body.postOwner).toBe("object");
      expect(res.body.postOwner).toHaveProperty("email" as Types.UserKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await getPostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await getPostById({
        params: { id: "invalid-id" },
        // @ts-expect-error
        query: { select: "invalid-select" },
      });
      const body = res.body as ValidationError | undefined;
      const paths = body?.flatMap((b) => b.issues.flatMap((issue) => issue.path));

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(2);
      for (const path of paths || []) {
        expect(["id", "select"]).toContain(path);
      }
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await getPostById({
        params: { id: "68d817527719e9421cb63734" },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("Returns filtered posts", async () => {
      const res = await getPosts({
        query: { postOwner: users[0]._id.toString() },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toHaveProperty(
        "postOwner" as Types.PostKeys,
        users[0]._id.toString()
      );
    });

    it("returns a list of posts with stripped properties", async () => {
      const res = await getPosts({
        query: { select: ["postOwner", "postTitle"] },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const img of res.body.data) {
        expect(Object.keys(img).length).toBe(3); // including _id by default
        expect(img).toHaveProperty("postOwner" as Types.PostKeys);
        expect(img).toHaveProperty("postTitle" as Types.PostKeys);
      }
    });

    it("returns a paginated list of posts", async () => {
      const res = await getPosts({
        query: { page: 1, limit: 1 },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
    });

    it("returns a sorted list of posts", async () => {
      const res = await getPosts({
        query: { sort: { photoWidth: "asc" } },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(1);
      for (let i = 1; i < res.body.data.length; i++) {
        expect(res.body.data[i - 1].photoWidth <= res.body.data[i].photoWidth).toBe(true);
      }
    });

    it("returns a list of posts with populated fields", async () => {
      const res = await getPosts({
        query: { embed: "postOwner" },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(1);
      for (const post of res.body.data) {
        expect(post).toHaveProperty("postOwner" as Types.PostKeys);
        expect(typeof post.postOwner).toBe("object");
        expect(post.postOwner).toHaveProperty("email" as Types.UserKeys);
      }
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await getPosts({
        // @ts-expect-error
        query: { limit: -5, page: "invalid" },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(2);
      for (const issue of body?.[0].issues || []) {
        expect(["limit", "page"]).toContain(issue.path[0]);
      }
    });
  });

  describe(`${routes.add.method.toUpperCase()} ${routes.add.path}`, () => {
    it("returns a validation error if missing required fields", async () => {
      // @ts-expect-error
      const res = await addPost({
        photo: images[0],
        postOwner: users[0]._id.toString(),
      });

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const res = await addPost({
        photo: images[0],
        postTitle: "New Post",
        postDescription: "This is a new post.",
        photoBlurHash: "LKO2?U%2Tw=ay~pofayay00ofayay",
        // @ts-expect-error
        postOwner: 12345,
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(1);
      for (const issue of body?.[0].issues || []) {
        expect(["postOwner"] as Types.PostKeys[]).toContain(issue.path[0]);
      }
    });

    it("returns a post without extra field", async () => {
      const res = await addPost({
        photo: images[0],
        postTitle: "New Post",
        postOwner: users[0]._id.toString(),
        postDescription: "This is a new post.",
        photoBlurHash: "LKO2?U%2Tw=ay~pofayay00ofayay",
        // @ts-expect-error
        extraField: "extra",
      });

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body).not.toHaveProperty("extraField");
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0]).toHaveProperty("_id" as Types.PostKeys);

      const res = await updatePostById({ id: posts[0]._id }, { postTitle: "Updated Test Post" });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("postTitle" as Types.PostKeys, "Updated Test Post");
      expect(res.body.postTitle !== posts[0].postTitle).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await updatePostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const res = await updatePostById(
        { id: "invalid-id" },
        // @ts-expect-error
        { postTitle: 12345 }
      );
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(2);
      for (const item of body || []) {
        expect(["id", "postTitle"] as Types.PostKeys[]).toContain(item.issues[0].path[0]);
      }
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await updatePostById(
        { id: "68d817527719e9421cb63734" },
        { postTitle: "Updated Title" }
      );

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.removeOneById.method.toUpperCase()} ${routes.removeOneById.path}`, () => {
    it("returns a successful response", async () => {
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0]).not.toHaveProperty("removedAt" as Types.PostKeys);

      const res = await removePostById({
        params: { id: posts[0]._id },
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getRes = await getPostById({
        params: { id: posts[0]._id },
      });

      expect(getRes.body).toHaveProperty("removedAt" as Types.PostKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await removePostById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await removePostById({
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
      const res = await removePostById({
        params: { id: "68d817527719e9421cb63734" },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.removeMany.method.toUpperCase()} ${routes.removeMany.path}`, () => {
    it("returns a successful response", async () => {
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0]).not.toHaveProperty("removedAt" as Types.PostKeys);
      expect(posts[1]).not.toHaveProperty("removedAt" as Types.PostKeys);

      const res = await removePosts({
        body: {
          ids: [posts[0]._id, posts[1]._id],
        },
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getRes1 = await getPostById({
        params: { id: posts[0]._id },
      });
      const getRes2 = await getPostById({
        params: { id: posts[1]._id },
      });

      expect(getRes1.body).toHaveProperty("removedAt" as Types.PostKeys);
      expect(getRes2.body).toHaveProperty("removedAt" as Types.PostKeys);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await removePosts();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await removePosts({
        body: {
          ids: ["invalid-id"],
        },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(1);
      expect(body?.[0].issues[0].path[0]).toBe("ids");
    });

    it("returns a not found error if none of the ids belong to any", async () => {
      const res = await removePosts({
        body: {
          ids: ["68d817527719e9421cb63734", "68d817527719e9421cb63735"],
        },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
