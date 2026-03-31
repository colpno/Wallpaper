import { expect, test } from "vitest";

import openApiToExpressPath from "./open-api-to-express-path.js";

test("openApiToExpressPath", () => {
  const path = "/users/{userId}/posts/{postId}";

  const result = openApiToExpressPath(path);

  expect(result).toBe(path.replaceAll("}", "").replaceAll("{", ":"));
});
