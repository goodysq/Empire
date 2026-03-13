import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import FeaturesSection from "@/components/website/FeaturesSection";
import HeroesGallery from "@/components/website/HeroesGallery";
import WorldSection from "@/components/website/WorldSection";
import NewsSection from "@/components/website/NewsSection";
import DownloadSection from "@/components/website/DownloadSection";
import Footer from "@/components/website/Footer";
import { prisma } from "@/lib/db";
import { toTraditional } from "@/lib/opencc";

// Always fetch fresh data — no static caching
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch live data from the database in parallel
  const [heroes, news, dlSettings] = await Promise.all([
    prisma.hero.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.siteSetting.findMany({
      where: { key: { in: ["ios_link", "android_link"] } },
    }),
  ]);

  const iosLink = dlSettings.find((s) => s.key === "ios_link")?.value ?? "";
  const androidLink = dlSettings.find((s) => s.key === "android_link")?.value ?? "";

  // Pre-convert Simplified → Traditional for zh-TW so the client NewsSection
  // component receives already-converted text in its titleZh / excerptZh props
  const convertedNews =
    locale === "zh-TW"
      ? news.map((n) => ({
          ...n,
          titleZh: toTraditional(n.titleZh, locale),
          excerptZh: toTraditional(n.excerptZh, locale),
        }))
      : news;

  return (
    <main className="bg-[#0A0806] min-h-screen">
      <Navbar locale={locale} />
      <HeroSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <FeaturesSection locale={locale} />
      <HeroesGallery locale={locale} heroes={heroes} />
      <WorldSection locale={locale} />
      <NewsSection locale={locale} news={convertedNews} />
      <DownloadSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <Footer locale={locale} iosLink={iosLink} androidLink={androidLink} />
    </main>
  );
}
