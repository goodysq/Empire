import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Locale = "zh" | "zh-TW" | "en";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Map locale to message file
  const messageLocale = locale === "zh-TW" ? "zh-TW" : locale;

  return {
    locale,
    messages: (await import(`../messages/${messageLocale}.json`)).default,
  };
});
