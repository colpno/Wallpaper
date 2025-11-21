import { HttpStatusCodes } from "@repo/shared";
import { beforeEach, describe, expect, it } from "vitest";

import createTestClient from "@/helpers/create-test-client";
import { deleteFiles } from "@/services/cloudinary.service";

import ExpiredMediaModel from "./expired-media.model";
import * as routes from "./media.routes";

const numberOfWithin30Days = 1;
const expiredMedias = [
  new ExpiredMediaModel({ publicId: "expired_media_1" }),
  new ExpiredMediaModel({ publicId: "expired_media_2" }),
  new ExpiredMediaModel({ publicId: "expired_media_3" }),
];
const oldExpiredMedias: typeof expiredMedias = [];
expiredMedias.slice(numberOfWithin30Days).forEach((m) => {
  const pastDate = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000 /* 35 days */);
  m.createdAt = pastDate;
  m.updatedAt = pastDate;
  oldExpiredMedias.push(m);
});
const deleteExpiredMedias = createTestClient(routes.deleteExpiredMedias);

beforeEach(async () => {
  await ExpiredMediaModel.insertMany(expiredMedias);
});

describe("Media routes", () => {
  describe(`${routes.deleteExpiredMedias.method.toUpperCase()} ${routes.deleteExpiredMedias.path}`, () => {
    it("deletes expired medias older than 30 days", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (deleteFiles as any).mockResolvedValue({
        deleted: Object.fromEntries(oldExpiredMedias.map((m) => [m.publicId, "deleted"])),
      });

      const deleteRes = await deleteExpiredMedias();

      expect(deleteRes.status).toBe(HttpStatusCodes.NO_CONTENT);

      const remainingExpiredMedias = await ExpiredMediaModel.find();

      expect(remainingExpiredMedias.length).toBe(numberOfWithin30Days);
      for (const media of remainingExpiredMedias) {
        expect(media.createdAt.getTime()).toBeGreaterThan(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 /* 30 days */).getTime()
        );
      }
    });

    it("returns not found when there are no expired medias", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (deleteFiles as any).mockResolvedValue({ deleted: {}, partial: {} });
      await ExpiredMediaModel.deleteMany({ _id: { $in: oldExpiredMedias.map((m) => m._id) } });

      const res = await deleteExpiredMedias();

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("returns not found when Cloudinary deletes nothing", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (deleteFiles as any).mockResolvedValue({ deleted: {}, partial: {} });

      const res = await deleteExpiredMedias();

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
