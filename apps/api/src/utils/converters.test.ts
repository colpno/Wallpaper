import { describe, expect, test } from "vitest";

import { openApiToExpressPath } from "./converters.js";

describe("converters", () => {
  test("openApiToExpressPath", () => {
    const path = "/path/{to}/api/{no}";

    const result = openApiToExpressPath(path);

    expect(result).toBe(path.replaceAll("}", "").replaceAll("{", ":"));
  });
});
