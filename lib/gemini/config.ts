/**
 * Gemini model IDs — keep in sync with https://ai.google.dev/gemini-api/docs/models
 * Pro: complex reasoning, grading, quiz generation.
 * Flash: low-latency chat, tutor, recommendations.
 */

export const GEMINI_PRO_MODEL = process.env.GEMINI_PRO_MODEL || "gemini-2.5-pro";
export const GEMINI_FLASH_MODEL = process.env.GEMINI_FLASH_MODEL || "gemini-2.5-flash";

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}
