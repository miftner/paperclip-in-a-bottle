import { describe, expect, it } from "vitest";
import {
  adapterTypeForAiProvider,
  aiProviderForAdapter,
} from "./provider-for-adapter";

describe("aiProviderForAdapter", () => {
  it("keeps the existing single-provider adapters", () => {
    expect(aiProviderForAdapter("claude_local")).toBe("anthropic");
    expect(aiProviderForAdapter("codex_local")).toBe("openai");
    expect(aiProviderForAdapter("grok_local")).toBe("xai");
    expect(aiProviderForAdapter("gemini_local")).toBeUndefined();
  });

  it("selects the OpenCode gateway from the configured model namespace", () => {
    expect(aiProviderForAdapter("opencode_local", "opencode-go/kimi-k3")).toBe(
      "opencode-go",
    );
    expect(
      aiProviderForAdapter(
        "opencode_local",
        "openrouter/anthropic/claude-sonnet-4.5",
      ),
    ).toBe("openrouter");
    expect(aiProviderForAdapter("opencode_local")).toBe("openrouter");
    expect(aiProviderForAdapter("opencode_local", "")).toBe("openrouter");
  });

  it("maps providers back to their harness", () => {
    expect(adapterTypeForAiProvider("opencode-go")).toBe("opencode_local");
    expect(adapterTypeForAiProvider("openrouter")).toBe("opencode_local");
    expect(adapterTypeForAiProvider("anthropic")).toBe("claude_local");
    expect(adapterTypeForAiProvider("openai")).toBe("codex_local");
    expect(adapterTypeForAiProvider("xai")).toBe("grok_local");
  });
});
