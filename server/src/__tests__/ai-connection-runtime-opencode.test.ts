import { describe, expect, it } from "vitest";
import {
  AI_AUTH_ENV_KEYS,
  buildOpenCodeGatewayEnv,
} from "../services/ai-connection-runtime.js";
import { PROVIDER_AUTH_ENV_KEYS } from "../services/agent-ai-connection-default.js";
import { readVerifiedLocalAiCredential } from "../services/local-ai-credentials.js";

describe("OpenCode gateway runtime credentials", () => {
  it("maps an OpenCode Go key to the opencode-go provider config", () => {
    expect(buildOpenCodeGatewayEnv("opencode-go", "go-secret")).toEqual({
      OPENCODE_CONFIG_CONTENT: JSON.stringify({
        provider: { "opencode-go": { options: { apiKey: "go-secret" } } },
      }),
      OPENCODE_DISABLE_PROJECT_CONFIG: "true",
    });
  });

  it("keeps the existing OpenRouter mapping", () => {
    const env = buildOpenCodeGatewayEnv("openrouter", "or-secret");
    expect(JSON.parse(env!.OPENCODE_CONFIG_CONTENT)).toEqual({
      provider: { openrouter: { options: { apiKey: "or-secret" } } },
    });
  });

  it("returns null for providers that are not OpenCode gateways", () => {
    expect(buildOpenCodeGatewayEnv("anthropic", "secret")).toBeNull();
    expect(buildOpenCodeGatewayEnv("openai", "secret")).toBeNull();
  });

  it("scrubs the OpenCode API key from inherited environments", () => {
    expect(AI_AUTH_ENV_KEYS).toContain("OPENCODE_API_KEY");
  });

  it("recognizes child-level OpenCode Go auth overrides", () => {
    expect(PROVIDER_AUTH_ENV_KEYS["opencode-go"]).toContain("OPENCODE_API_KEY");
    expect(PROVIDER_AUTH_ENV_KEYS["opencode-go"]).toContain(
      "OPENCODE_CONFIG_CONTENT",
    );
  });

  it("rejects API-key-only providers before touching the filesystem", async () => {
    await expect(readVerifiedLocalAiCredential("opencode-go")).rejects.toThrow(
      "OpenCode Go requires an API key.",
    );
    await expect(readVerifiedLocalAiCredential("openrouter")).rejects.toThrow(
      "OpenRouter requires an API key.",
    );
  });
});
