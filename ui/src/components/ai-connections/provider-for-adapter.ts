import { requiredModelPrefixForAiProvider, type AiProvider } from "@paperclipai/shared";

/**
 * The provider an adapter's connection field offers.
 *
 * OpenCode is the multi-provider case: one harness reaches several gateways,
 * and its API-key credentials live in separate model namespaces. The configured
 * model is what picks the namespace at run time, so it also picks which
 * connection the field edits. Everything else is a fixed 1:1 mapping.
 */
const ADAPTER_AI_PROVIDER: Record<string, AiProvider> = {
  claude_local: "anthropic",
  codex_local: "openai",
  grok_local: "xai",
};

/** The OpenCode gateway providers, in model-namespace terms. */
const OPENCODE_GATEWAY_PROVIDERS: readonly AiProvider[] = [
  "opencode-go",
  "openrouter",
];

/** Subscription/API-key providers that map to exactly one harness. */
const SINGLE_HARNESS_PROVIDER: Record<
  "anthropic" | "openai" | "xai",
  "claude_local" | "codex_local" | "grok_local"
> = {
  anthropic: "claude_local",
  openai: "codex_local",
  xai: "grok_local",
};

export function aiProviderForAdapter(
  adapterType: string,
  model?: unknown,
): AiProvider | undefined {
  if (adapterType === "opencode_local") {
    if (typeof model === "string") {
      for (const provider of OPENCODE_GATEWAY_PROVIDERS) {
        const prefix = requiredModelPrefixForAiProvider(provider);
        if (prefix && model.startsWith(prefix)) return provider;
      }
    }
    // No model yet: keep the historical OpenRouter binding until the model
    // chooses a namespace, so existing drafts and agent configs are unchanged.
    return "openrouter";
  }
  return ADAPTER_AI_PROVIDER[adapterType];
}

/** The harness an AI connection provider runs on. */
export function adapterTypeForAiProvider(
  provider: AiProvider,
): "claude_local" | "codex_local" | "grok_local" | "opencode_local" | undefined {
  if (provider === "opencode-go" || provider === "openrouter")
    return "opencode_local";
  return SINGLE_HARNESS_PROVIDER[provider];
}
