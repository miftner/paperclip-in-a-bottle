import { describe, expect, it } from "vitest";
import { DEFAULT_OPENCODE_GO_MODEL } from "@paperclipai/adapter-opencode-local";
import {
  API_KEY_ENV_KEYS,
  apiKeyEnvKeyFor,
  defaultOnboardingModelFor,
} from "./onboarding-provider";

describe("connect-step provider wiring", () => {
  it("names the OpenCode Go API key variable on the OpenCode source", () => {
    expect(API_KEY_ENV_KEYS.opencode_local).toBe("OPENCODE_API_KEY");
    expect(apiKeyEnvKeyFor("opencode_local")).toBe("OPENCODE_API_KEY");
    expect(apiKeyEnvKeyFor("claude_local")).toBe("ANTHROPIC_API_KEY");
    expect(apiKeyEnvKeyFor("unknown_local")).toBe("API_KEY");
  });

  it("hires OpenCode with an OpenCode Go model by default", () => {
    expect(defaultOnboardingModelFor("opencode_local")).toBe(
      DEFAULT_OPENCODE_GO_MODEL,
    );
    expect(defaultOnboardingModelFor("claude_local")).toBe("");
  });
});
