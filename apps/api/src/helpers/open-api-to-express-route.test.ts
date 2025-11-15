import { expect, test } from "vitest";

import openApiToExpressRoute from "./open-api-to-express-route";

test("openApiToExpressRoute", () => {
  const result = openApiToExpressRoute("/users/{userId}/posts/{postId}");

  expect(result).toBe("/users/:userId/posts/:postId");
});
