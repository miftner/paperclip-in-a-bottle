import { describe, expect, it } from "vitest";
import {
  AI_CONNECTION_CAPABILITIES,
  aiProviderSchema,
  defaultAiAuthMethod,
  isAiConnectionCompatible,
  requiredModelPrefixForAiProvider,
} from "./ai-connections.js";

describe("OpenCode Go provider contract", () => {
  it("registers opencode-go as an OpenCode API-key provider", () => {
    expect(aiProviderSchema.parse("opencode-go")).toBe("opencode-go");
    expect(AI_CONNECTION_CAPABILITIES["opencode-go"]).toEqual({
      name: "OpenCode Go",
      methods: {
        api_key: { adapters: ["opencode_local"], envKey: "OPENCODE_API_KEY" },
      },
    });
    expect(defaultAiAuthMethod("opencode-go")).toBe("api_key");
    expect(defaultAiAuthMethod("anthropic")).toBe("subscription");
  });

  it("binds OpenCode gateway credentials to their model namespace", () => {
    expect(requiredModelPrefixForAiProvider("opencode-go")).toBe("opencode-go/");
    expect(requiredModelPrefixForAiProvider("openrouter")).toBe("openrouter/");
    expect(requiredModelPrefixForAiProvider("anthropic")).toBeUndefined();
    expect(requiredModelPrefixForAiProvider("openai")).toBeUndefined();
  });

  it("requires a matching model namespace for OpenCode gateway credentials", () => {
    const go = {
      provider: "opencode-go",
      method: "api_key",
      mode: "responsible_user",
    } as const;
    expect(
      isAiConnectionCompatible(go, "opencode_local", "opencode-go/kimi-k3"),
    ).toBe(true);
    expect(
      isAiConnectionCompatible(
        go,
        "opencode_local",
        "openrouter/anthropic/claude-sonnet-4.5",
      ),
    ).toBe(false);
    expect(isAiConnectionCompatible(go, "opencode_local", undefined)).toBe(false);
    expect(isAiConnectionCompatible(go, "claude_local", "opencode-go/kimi-k3")).toBe(
      false,
    );
    const openrouter = {
      provider: "openrouter",
      method: "api_key",
      mode: "responsible_user",
    } as const;
    expect(
      isAiConnectionCompatible(openrouter, "opencode_local", "opencode-go/kimi-k3"),
    ).toBe(false);
    expect(
      isAiConnectionCompatible(
        openrouter,
        "opencode_local",
        "openrouter/anthropic/claude-sonnet-4.5",
      ),
    ).toBe(true);
  });
});
