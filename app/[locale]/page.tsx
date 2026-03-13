import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import FeaturesSection from "@/components/website/FeaturesSection";
import HeroesGallery from "@/components/website/HeroesGallery";
import WorldSection from "@/components/website/WorldSection";
import NewsSection from "@/components/website/NewsSection";
import DownloadSection from "@/components/website/DownloadSection";
import CustomSection from "@/components/website/CustomSection";
import Footer from "@/components/website/Footer";
import { prisma } from "@/lib/db";
import { toTraditional } from "@/lib/opencc";

// System section keys that have dedicated components — excluded from custom rendering
const SYSTEM_SECTION_KEYS = new Set([
  "hero", "features", "heroes_gallery", "world", "news", "download",
  "support_privacy", "support_terms", "support_contact", "support_faq",
]);

// Always fetch fresh data — no static caching
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch live data from the database in parallel
  const [heroes, news, allSettings, customSections] = await Promise.all([
    prisma.hero.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.siteSetting.findMany(),
    prisma.pageSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  // Filter out system sections — only keep user-created custom sections
  const userSections = customSections.filter(
    (s) => !SYSTEM_SECTION_KEYS.has(s.key)
  );

  const gs = (key: string) => allSettings.find((s) => s.key === key)?.value ?? "";

  const iosLink = gs("ios_link");
  const androidLink = gs("android_link");
  const logoUrl = gs("logo_url");
  const gameNameZh = gs("game_name_zh");
  const gameNameEn = gs("game_name_en");

  const socialLinks = {
    weibo: gs("weibo_url") || undefined,
    wechat: gs("wechat_id") || undefined,
    tiktok: gs("tiktok_url") || undefined,
    youtube: gs("youtube_url") || undefined,
    twitter: gs("twitter_url") || undefined,
    discord: gs("discord_url") || undefined,
    telegram: gs("telegram_url") || undefined,
  };

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
      <Navbar locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />
      <HeroSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <FeaturesSection locale={locale} />
      <HeroesGallery locale={locale} heroes={heroes} />
      <WorldSection locale={locale} />
      <NewsSection locale={locale} news={convertedNews} />
      {/* Custom sections added from admin — rendered after news, before download */}
      {userSections.map((section) => (
        <CustomSection
          key={section.key}
          locale={locale}
          titleZh={section.titleZh ?? undefined}
          titleEn={section.titleEn ?? undefined}
          subtitleZh={section.subtitleZh ?? undefined}
          subtitleEn={section.subtitleEn ?? undefined}
          contentZh={section.contentZh ?? undefined}
          contentEn={section.contentEn ?? undefined}
          imageUrl={section.imageUrl ?? undefined}
        />
      ))}
      <DownloadSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <Footer locale={locale} iosLink={iosLink} androidLink={androidLink} socialLinks={socialLinks} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />
    </main>
  );
}
