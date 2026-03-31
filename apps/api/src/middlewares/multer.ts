import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import handler from "multer";

import createErrorObjectFromZod from "@/utils/create-error-object-from-zod.js";

type Method = keyof handler.Multer;

const multer =
  <M extends Method>(method: M, ...args: Parameters<handler.Multer[M]>) =>
  (validationSchema?: ZodType): RequestHandler =>
  (req, res, next) =>
    handler()[method](...(args as [never]))(req, res, function (error: unknown) {
      if (error) throw error;

      // Validate
      const methods: Method[] = ["single", "array", "fields"];
      const data = method === "single" ? req.file : req.files;

      if (validationSchema && data && methods.some((m) => m === method)) {
        const result = validationSchema.safeParse(data);

        if (!result.success) {
          return res
            .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
            .json(createErrorObjectFromZod(result.error));
        }
      }

      return next();
    });

export default multer;
