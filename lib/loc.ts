/** Pick the right string for zh / zh-TW / en */
export function loc(locale: string, zh: string, tw: string, en: string): string {
  if (locale === "zh-TW") return tw;
  if (locale !== "en") return zh;
  return en;
}
