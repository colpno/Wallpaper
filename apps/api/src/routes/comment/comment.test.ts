/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ValidationError } from "@/constants/schema.constants";
import type { Comment, CommentKeys, Post, PostKeys, UserKeys } from "@/types/model.types";
import type { ObjectIdToString } from "mongoose";

import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import createTestClient from "@/helpers/create-test-client";
import { addPost } from "@/lib/test/helpers";
import { images } from "@/lib/test/variables";

import UserModel from "../user/user.model";
import * as routes from "./comment.routes";

const users = [
  new UserModel({
    username: "testuser1",
    email: "test@example.com",
    password: "password",
  }),
  new UserModel({
    username: "testuser2",
    email: "test2@example.com",
    password: "password",
  }),
];
let posts: Array<ObjectIdToString<Post>> = [];
let comments: Array<ObjectIdToString<Comment>> = [];
const getComments = createTestClient(routes.getMany);
const addComment = createTestClient(routes.add);
const updateCommentById = createTestClient(routes.updateOneById);
const removeCommentById = createTestClient(routes.deleteOneById);

beforeEach(async () => {
  await UserModel.insertMany(users);

  const postResponses = [
    await addPost({
      photo: images[0],
      postTitle: "Test Post",
      postDescription: "This is a test post.",
      postOwner: users[0]._id.toString(),
      photoBlurHash: "LKO2?U%2Tw=^]-;RjS%M%0L%1J5R*",
    }),
    await addPost({
      photo: images[1],
      postTitle: "Another Test Post",
      postDescription: "This is another test post.",
      postOwner: users[1]._id.toString(),
      photoBlurHash: "LKO2?U%2Tw=^]-;RjS%M%0L%1J5R*",
    }),
  ];
  const postErrors = postResponses
    .filter((res) => res.status !== HttpStatusCodes.CREATED)
    .map((res) => res.text);
  if (postErrors.length > 0) {
    postErrors.forEach(console.error);
    throw new Error("Failed to create test posts");
  }
  posts = postResponses.map((res) => res.body);

  const commentResponses = [
    await addComment({
      body: {
        owner: users[0]._id.toString(),
        postId: posts[0]._id,
        text: "Comment 1.",
      },
    }),
    await addComment({
      body: {
        owner: users[1]._id.toString(),
        postId: posts[1]._id,
        text: "Comment 2.",
      },
    }),
  ];
  const commentErrors = commentResponses
    .filter((res) => res.status !== HttpStatusCodes.CREATED)
    .map((res) => res.text);
  if (commentErrors.length > 0) {
    commentErrors.forEach(console.error);
    throw new Error("Failed to create test comments");
  }
  comments = commentResponses.map((res) => res.body);
});

describe("Comment routes", () => {
  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    it("Returns filtered comments", async () => {
      const res = await getComments({
        query: { owner: users[0]._id.toString() },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0]).toHaveProperty("owner" as CommentKeys, users[0]._id.toString());
    });

    it("returns a list of comments with stripped properties", async () => {
      const res = await getComments({
        query: { select: ["text", "owner"] },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const cmt of res.body.data) {
        expect(Object.keys(cmt).length).toBe(3); // including _id by default
        expect(cmt).toHaveProperty("text" as CommentKeys);
        expect(cmt).toHaveProperty("owner" as CommentKeys);
      }
    });

    it("returns a paginated list of comments", async () => {
      const res = await getComments({
        query: { page: 1, limit: 1 },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(1);
    });

    it("returns a sorted list of comments", async () => {
      const res = await getComments({
        query: { sort: { text: "asc" } },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(1);
      for (let i = 1; i < res.body.data.length; i++) {
        expect(res.body.data[i - 1].text <= res.body.data[i].text).toBe(true);
      }
    });

    it("returns a list of comments with populated fields", async () => {
      const res = await getComments({
        query: { embed: ["owner", "postId"] },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(1);
      for (const post of res.body.data) {
        expect(post).toHaveProperty("owner" as CommentKeys);
        expect(typeof post.owner).toBe("object");
        expect(post.owner).toHaveProperty("_id" as UserKeys);
        expect(post).toHaveProperty("postId" as CommentKeys);
        expect(typeof post.postId).toBe("object");
        expect(post.postId).toHaveProperty("_id" as PostKeys);
      }
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await getComments({
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
      const res = await addComment({
        // @ts-expect-error
        body: {
          owner: users[0]._id.toString(),
        },
      });

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await addComment({
        body: {
          // @ts-expect-error
          owner: 12345,
          postId: posts[0]._id + "invalid",
          text: "New Comment",
        },
      });
      const body = res.body as ValidationError | undefined;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(1);
      expect(body?.[0].issues).toHaveLength(2);
      for (const issue of body?.[0].issues || []) {
        expect(["owner", "postId"] as CommentKeys[]).toContain(issue.path[0]);
      }
    });

    it("returns a comment without extra field", async () => {
      const res = await addComment({
        body: {
          text: "New Comment",
          owner: users[0]._id.toString(),
          postId: posts[0]._id,
          // @ts-expect-error
          extraField: "extra",
        },
      });

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body).not.toHaveProperty("extraField");
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    it("returns a successful response", async () => {
      expect(comments.length).toBeGreaterThan(0);
      expect(comments[0]).toHaveProperty("_id" as CommentKeys);

      const res = await updateCommentById({
        params: { id: comments[0]._id },
        body: {
          text: "Updated Comment Text",
        },
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body).toHaveProperty("text" as CommentKeys);
      expect(res.body.text !== comments[0].text).toBe(true);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await updateCommentById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await updateCommentById({
        params: { id: "invalid" },
        body: {
          // @ts-expect-error
          text: 12345,
        },
      });
      const body = res.body as ValidationError | undefined;
      const paths = body?.flatMap((b) => b.issues.flatMap((issue) => issue.path));

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toBeInstanceOf(Array);
      expect(body).toHaveLength(2);
      for (const path of paths || []) {
        expect(["id", "text"] as CommentKeys[]).toContain(path);
      }
    });

    it("returns a not found error if id does not belong to any", async () => {
      const res = await updateCommentById({
        params: { id: "68d817527719e9421cb63734" },
        body: { text: "Updated Comment Text" },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
    it("returns a successful response", async () => {
      expect(comments.length).toBeGreaterThan(0);
      expect(comments[0]).not.toHaveProperty("removedAt" as CommentKeys);

      const res = await removeCommentById({
        params: { id: comments[0]._id },
      });

      expect(res.status).toBe(HttpStatusCodes.NO_CONTENT);

      const getRes = await getComments({
        query: { _id: comments[0]._id },
      });

      expect(getRes.status).toBe(HttpStatusCodes.OK);
      expect(getRes.body.data).toBeInstanceOf(Array);
      expect(getRes.body.data.length).toBe(0);
    });

    it("returns a validation error if missing required fields", async () => {
      const res = await removeCommentById();

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("returns a validation error if payload is invalid", async () => {
      const res = await removeCommentById({
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
      const res = await removeCommentById({
        params: { id: "68d817527719e9421cb63734" },
      });

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
