import { HttpStatusCodes } from "@wallpaper/shared";
import type { Types } from "mongoose";
import path from "path";
import { describe, expect, it, vi } from "vitest";

import { createTestClient } from "@/helpers";
import env from "@/lib/env";
import type { ExtractRouteRequest, Image } from "@/types";

import imageRouter from "./image.index";
import * as routes from "./image.routes";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

vi.mock("../../services/cloudinary.service.ts", () => {
  return {
    uploadImage: vi.fn().mockResolvedValue({
      asset_id: "953ecf00dbb016e463185697b0e019e4",
      public_id: "wallpaper-app/2025/9/qiqrp5jwxur3xvdtmr4v",
      version: 1758992209,
      version_id: "614eefcc9711828a59069947032ff877",
      signature: "f1007a8692bcec4dd8d4d6a2524f1e6114951f18",
      width: 1024,
      height: 768,
      format: "jpg",
      resource_type: "image",
      created_at: "2025-09-27T16:56:49Z",
      tags: [],
      bytes: 67551,
      type: "upload",
      etag: "7471b8ad4afca29ba7e67c7d79ba924c",
      placeholder: false,
      url: "http://res.cloudinary.com/dipmvdik6/image/upload/v1758992209/wallpaper-app/2025/9/qiqrp5jwxur3xvdtmr4v.jpg",
      secure_url:
        "https://res.cloudinary.com/dipmvdik6/image/upload/v1758992209/wallpaper-app/2025/9/qiqrp5jwxur3xvdtmr4v.jpg",
      folder: "wallpaper-app/2025/9",
      access_mode: "public",
      api_key: "355932666351752",
    }),
    destroyImage: vi.fn().mockResolvedValue("ok"),
  };
});

const client = createTestClient(imageRouter);

describe("Image routes", () => {
  const getMany = client[routes.getMany.method](routes.getMany);
  const addMany = client[routes.add.method](routes.add);
  const updateOne = client[routes.updateOneById.method](routes.updateOneById);
  // const deleteOne = client[routes.deleteOneById.method](routes.deleteOneById);
  // const deleteMany = client[routes.deleteMany.method](routes.deleteMany);

  const docId = "68d817527719e9421cb63735" as unknown as Types.ObjectId;
  const image1 = path.join(__dirname, "../../assets/test-image-1.jpg");
  const image2 = path.join(__dirname, "../../assets/test-image-2.jpg");

  describe(`${routes.getMany.method.toUpperCase()} ${routes.getMany.path}`, () => {
    const arg: ExtractRouteRequest<typeof routes.getMany> = {
      query: {
        publicId: "wallpaper-app/2025/9/qiqrp5jwxur3xvdtmr4v",
      },
    };

    it("should return images", async () => {
      const res = await getMany(arg);
      const body = res.body as Image[];

      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(body).toBeInstanceOf(Array);
      expect(body[0]).toHaveProperty("publicId", arg.query.publicId);
    });

    it("should return empty array if not match any filter", async () => {
      arg.query.publicId = "wallpaper-app/2025/9/null";

      const res = await getMany(arg);

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("should return a validation error if query publicId is invalid", async () => {
      // @ts-expect-error
      arg.query.publicId = null;

      const res = await getMany(arg);
      const body = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("issues");
    });
  });

  describe(`${routes.add.method.toUpperCase()} ${routes.add.path}`, () => {
    it("should return a success response", async () => {
      const res = await addMany().attach("images", image1);
      const resBody = res.body;

      expect(resBody).toHaveProperty("message");
    });

    it("should return a validation error if body images is missing", async () => {
      const res = await addMany();
      const body = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("issues");
    });

    it("should return a validation error if body images is invalid", async () => {
      // @ts-expect-error
      const res = await addMany().attach("images", null);
      const body = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("issues");
    });
  });

  describe(`${routes.updateOneById.method.toUpperCase()} ${routes.updateOneById.path}`, () => {
    const arg: ExtractRouteRequest<typeof routes.updateOneById> = {
      params: {
        id: docId,
      },
      // @ts-expect-error
      body: undefined, // to be set via attach()
    };

    it("should return a success response", async () => {
      const res = await updateOne(arg).attach("image", image2);
      const resBody = res.body;

      expect(resBody).toHaveProperty("message");
    });

    it("should return a not found error if param id does not belong to any", async () => {
      // @ts-expect-error
      arg.params.id = "68d817527719e9421cb63734";

      const res = await updateOne(arg).attach("image", image2);
      const resBody = res.body;

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(resBody).toHaveProperty("message");
    });

    it("should return a validation error if param id is missing", async () => {
      // @ts-expect-error
      arg.params.id = undefined;

      const res = await updateOne(arg).attach("image", image2);
      const resBody = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(resBody).toHaveProperty("name");
      expect(resBody).toHaveProperty("issues");
    });

    it("should return a validation error if param id is invalid", async () => {
      // @ts-expect-error
      arg.params.id = "invalid-id";

      const res = await updateOne(arg).attach("image", image2);
      const resBody = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(resBody).toHaveProperty("name");
      expect(resBody).toHaveProperty("issues");
    });

    it("should return a validation error if body image is missing", async () => {
      const res = await updateOne(arg);
      const resBody = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(resBody).toHaveProperty("name");
      expect(resBody).toHaveProperty("issues");
    });

    it("should return a validation error if body image is invalid", async () => {
      // @ts-expect-error
      const res = await updateOne(arg).attach("image", null);
      const resBody = res.body;

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      expect(resBody).toHaveProperty("name");
      expect(resBody).toHaveProperty("issues");
    });
  });

  // describe(`${routes.deleteOneById.method.toUpperCase()} ${routes.deleteOneById.path}`, () => {
  //   const arg: ExtractRouteRequest<typeof routes.deleteOneById> = {
  //     params: {
  //       // @ts-expect-error
  //       id: docId,
  //     },
  //   };

  //   it("should return a success response", async () => {
  //     const res = await deleteOne(arg);
  //     const resBody = res.body;

  //     expect(resBody).toHaveProperty("message");
  //   });

  //   it("should return a not found error if id does not belong to any", async () => {
  //     // @ts-expect-error
  //     arg.params.id = "68d817527719e9421cb63734";

  //     const res = await deleteOne(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
  //     expect(resBody).toHaveProperty("message");
  //   });

  //   it("should return a validation error if id is missing", async () => {
  //     // @ts-expect-error
  //     arg.params.id = undefined;

  //     const res = await deleteOne(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  //     expect(resBody).toHaveProperty("name");
  //     expect(resBody).toHaveProperty("issues");
  //   });

  //   it("should return a validation error if id is invalid", async () => {
  //     // @ts-expect-error
  //     arg.params.id = "invalid-id";

  //     const res = await deleteOne(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  //     expect(resBody).toHaveProperty("name");
  //     expect(resBody).toHaveProperty("issues");
  //   });
  // });

  // describe(`${routes.deleteMany.method.toUpperCase()} ${routes.deleteMany.path}`, () => {
  //   const arg: ExtractRouteRequest<typeof routes.deleteMany> = {
  //     body: {
  //       // @ts-expect-error
  //       ids: ["68d817527719e9421cb63735"],
  //     },
  //   };

  //   it("should return a success response", async () => {
  //     const res = await deleteMany(arg);
  //     const resBody = res.body;

  //     expect(resBody).toHaveProperty("message");
  //   });

  //   it("should return a not found error if ids do not belong to any", async () => {
  //     // @ts-expect-error
  //     arg.body.ids[0] = "68d817527719e9421cb63734";

  //     const res = await deleteMany(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
  //     expect(resBody).toHaveProperty("message");
  //   });

  //   it("should return a validation error if ids is missing", async () => {
  //     // @ts-expect-error
  //     arg.body.ids = undefined;

  //     const res = await deleteMany(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  //     expect(resBody).toHaveProperty("name");
  //     expect(resBody).toHaveProperty("issues");
  //   });

  //   it("should return a validation error if id is invalid", async () => {
  //     // @ts-expect-error
  //     arg.body.ids[0] = "invalid-id";

  //     const res = await deleteMany(arg);
  //     const resBody = res.body;

  //     expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  //     expect(resBody).toHaveProperty("name");
  //     expect(resBody).toHaveProperty("issues");
  //   });
  // });
});
