import { isObjectIdOrHexString, Types } from "mongoose";
import z from "zod";

export const isMongoObjectId = (val: string): boolean => isObjectIdOrHexString(val);
export const isMongoObjectIdMsg = "Invalid MongoDB ObjectId";

export const enumMsg = <T extends string>(enumValues: ReadonlyArray<T>): string => {
  return `Only '${enumValues.join("', '")}' are allowed`;
};

export const atLeastOneField = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length > 0;
};
export const atLeastOneFieldMsg = <T extends string>(values?: ReadonlyArray<T>) => {
  const fields = values ? `: '${values.join("', '")}'` : "";
  return `At least one field${fields} is required`;
};

export const objectIdSchema = z
  .string()
  .refine(isMongoObjectId, isMongoObjectIdMsg)
  .transform((val) => new Types.ObjectId(val));

export const stringSchema = z.string().trim();

export const urlSchema = z.url().trim();
