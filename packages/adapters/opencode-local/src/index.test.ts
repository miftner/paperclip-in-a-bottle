import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPENCODE_GO_MODEL,
  DEFAULT_OPENCODE_LOCAL_MODEL,
  models,
} from "./index.js";

describe("opencode-local model catalog", () => {
  it("ships OpenCode Go models under the opencode-go namespace", () => {
    expect(DEFAULT_OPENCODE_GO_MODEL.startsWith("opencode-go/")).toBe(true);
    expect(models.some((model) => model.id === DEFAULT_OPENCODE_GO_MODEL)).toBe(true);
    expect(
      models.filter((model) => model.id.startsWith("opencode-go/")).length,
    ).toBeGreaterThanOrEqual(5);
  });

  it("keeps the existing default model", () => {
    expect(DEFAULT_OPENCODE_LOCAL_MODEL).toBe("openai/gpt-5.2-codex");
    expect(models.some((model) => model.id === DEFAULT_OPENCODE_LOCAL_MODEL)).toBe(
      true,
    );
  });
});
