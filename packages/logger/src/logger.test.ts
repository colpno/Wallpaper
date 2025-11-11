import { describe, expect, it, vi } from "vitest";

import { createLogger } from ".";

const logger = createLogger({
  level: "silent",
});

vi.spyOn(logger, "trace");
vi.spyOn(logger, "debug");
vi.spyOn(logger, "info");
vi.spyOn(logger, "warn");
vi.spyOn(logger, "error");
vi.spyOn(logger, "fatal");

describe("@repo/logger", () => {
  it("prints a trace log", () => {
    logger.trace("hello");

    expect(logger.trace).toBeCalledWith("hello");
  });

  it("prints a debug log", () => {
    logger.debug("hello");

    expect(logger.debug).toBeCalledWith("hello");
  });

  it("prints an info log", () => {
    logger.info("hello");

    expect(logger.info).toBeCalledWith("hello");
  });

  it("prints a warn log", () => {
    logger.warn("hello");

    expect(logger.warn).toBeCalledWith("hello");
  });

  it("prints an error log", () => {
    logger.error("hello");

    expect(logger.error).toBeCalledWith("hello");
  });

  it("prints a fatal log", () => {
    logger.fatal("hello");

    expect(logger.fatal).toBeCalledWith("hello");
  });
});
