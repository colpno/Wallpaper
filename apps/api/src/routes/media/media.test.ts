import { HttpStatusCodes } from "@repo/shared";
import type { ExpiredMediaDB } from "@repo/types";
import { beforeEach, describe, expect, it } from "vitest";

import createTestClient from "@/helpers/create-test-client.js";
import { deleteFiles } from "@/services/cloudinary.service.js";
import { seedDatabase, type SeededDB } from "@/test/samples.js";

import ExpiredMediaModel from "./expired-media.model.js";
import * as routes from "./media.routes.js";

let db: SeededDB;
let oldExpiredMedias: ExpiredMediaDB[];

const deleteExpiredMedias = createTestClient(routes.deleteExpiredMedias);

describe("Media routes", () => {
  beforeEach(async () => {
    db = await seedDatabase();

    const now = new Date();
    oldExpiredMedias = await ExpiredMediaModel.find({
      createdAt: {
        $lte: new Date(now.setMonth(now.getMonth() - 1)),
      },
    }).lean<ExpiredMediaDB[]>();
  });

  describe(`${routes.deleteExpiredMedias.method.toUpperCase()} ${routes.deleteExpiredMedias.path}`, () => {
    it("deletes expired medias older than 30 days", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (deleteFiles as any).mockResolvedValue({
        deleted: Object.fromEntries(oldExpiredMedias.map((m) => [m.publicId, "deleted"])),
      });

      const deleteRes = await deleteExpiredMedias();

      expect(deleteRes.status).toBe(HttpStatusCodes.NO_CONTENT);

      const remainingExpiredMedias = await ExpiredMediaModel.find().lean<ExpiredMediaDB[]>();

      expect(remainingExpiredMedias.length).toBe(db.expiredMedias.length - oldExpiredMedias.length);
      for (const media of remainingExpiredMedias) {
        expect(new Date(media.createdAt).getTime()).toBeGreaterThan(
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
