import * as OpenCC from "opencc-js";

// Singleton converter — Simplified Chinese → Traditional Chinese (Taiwan phrase forms)
// Initialized once at module load to avoid repeated overhead
const converter = OpenCC.Converter({ from: "cn", to: "twp" });

/**
 * Convert Simplified Chinese text to Traditional Chinese.
 * Returns the text unchanged for any locale other than "zh-TW".
 */
export function toTraditional(
  text: string | null | undefined,
  locale: string
): string {
  if (!text) return "";
  if (locale !== "zh-TW") return text;
  return converter(text);
}
