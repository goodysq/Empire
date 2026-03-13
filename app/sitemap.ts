import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
const LOCALES = ["zh", "zh-TW", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, guides] = await Promise.all([
    prisma.news.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.guide.findMany({
      where: { isVisible: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({ url: `${BASE_URL}/${locale}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${BASE_URL}/${locale}/news`, changeFrequency: "daily", priority: 0.8 });
    entries.push({ url: `${BASE_URL}/${locale}/support`, changeFrequency: "monthly", priority: 0.5 });
  }

  for (const article of news) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/news/${article.id}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const guide of guides) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/guides/${guide.id}`,
        lastModified: guide.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
