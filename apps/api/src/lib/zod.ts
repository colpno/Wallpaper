import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod/v4";

extendZodWithOpenApi(z);

export const atLeastOneFieldDefined = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).some((v) => v !== undefined);

export default z;
