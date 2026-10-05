import { DEFAULT_OPENCODE_GO_MODEL } from "@paperclipai/adapter-opencode-local";

/**
 * The environment variable each connect-step source reads its key from.
 *
 * Named rather than described in the field above it, because the customer knows
 * which key they are holding and does not know where this step will put it.
 */
export const API_KEY_ENV_KEYS: Record<string, string> = {
  claude_local: "ANTHROPIC_API_KEY",
  codex_local: "OPENAI_API_KEY",
  opencode_local: "OPENCODE_API_KEY",
};

export function apiKeyEnvKeyFor(adapterType: string): string {
  return API_KEY_ENV_KEYS[adapterType] ?? "API_KEY";
}

/**
 * The model the connect step hires with when the selected source has no model
 * picker.
 *
 * OpenCode authenticates its API-key plans by model namespace: an OpenCode Go
 * key only reaches `opencode-go/*` models. The OpenCode tile therefore starts
 * on an OpenCode Go model, while every other source keeps the adapter's own
 * default.
 */
export function defaultOnboardingModelFor(adapterType: string): string {
  return adapterType === "opencode_local" ? DEFAULT_OPENCODE_GO_MODEL : "";
}
