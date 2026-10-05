import { describe, expect, it } from "vitest";
import { validateAiApiKey } from "../routes/ai-connections.js";

function recordingFetch(status = 200) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const request = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return new Response(null, { status });
  }) as typeof fetch;
  return { calls, request };
}

describe("AI API key validation endpoints", () => {
  it("validates OpenCode Go keys against the fixed Go gateway endpoint", async () => {
    const { calls, request } = recordingFetch();
    await validateAiApiKey("opencode-go", "go-secret", request);
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://opencode.ai/zen/go/v1/models");
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer go-secret");
    expect(calls[0]!.init.redirect).toBe("error");
  });

  it("reports a rejected OpenCode Go key without provider detail", async () => {
    const { request } = recordingFetch(401);
    await expect(validateAiApiKey("opencode-go", "bad", request)).rejects.toThrow(
      "The provider rejected this API key.",
    );
  });
});
