import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import FeaturesSection from "@/components/website/FeaturesSection";
import HeroesGallery from "@/components/website/HeroesGallery";
import WorldSection from "@/components/website/WorldSection";
import NewsSection from "@/components/website/NewsSection";
import DownloadSection from "@/components/website/DownloadSection";
import CustomSectionBlock from "@/components/website/CustomSectionBlock";
import Footer from "@/components/website/Footer";
import { prisma } from "@/lib/db";
import { toTraditional } from "@/lib/opencc";

// System section keys that have dedicated components
const SYSTEM_KEYS = new Set([
  "hero", "features", "heroes_gallery", "world", "news", "download",
  "support_privacy", "support_terms", "support_contact", "support_faq",
]);

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [heroes, news, allSettings, allSections, navItems] = await Promise.all([
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
    // Fetch ALL visible sections in DB order — used to determine render order
    prisma.pageSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    // DB-managed nav items
    prisma.navItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

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

  // Custom nav items from sections with showInNav=true (non-system)
  const customNavSections = allSections.filter(
    (s) => !SYSTEM_KEYS.has(s.key) && s.showInNav
  );

  const convertedNews =
    locale === "zh-TW"
      ? news.map((n) => ({
          ...n,
          titleZh: toTraditional(n.titleZh, locale),
          excerptZh: toTraditional(n.excerptZh, locale),
        }))
      : news;

  // Render sections in DB order
  // System sections use fixed components; custom sections use CustomSectionBlock
  const renderedSections = allSections.map((section) => {
    switch (section.key) {
      case "hero":
        return <HeroSection key="hero" locale={locale} iosLink={iosLink} androidLink={androidLink} />;
      case "features":
        return <FeaturesSection key="features" locale={locale} />;
      case "heroes_gallery":
        return <HeroesGallery key="heroes_gallery" locale={locale} heroes={heroes} />;
      case "world":
        return <WorldSection key="world" locale={locale} />;
      case "news":
        return <NewsSection key="news" locale={locale} news={convertedNews} />;
      case "download":
        return <DownloadSection key="download" locale={locale} iosLink={iosLink} androidLink={androidLink} />;
      default:
        // Skip support page sections — they only render on /support
        if (section.key.startsWith("support_")) return null;
        // Render custom user-added sections
        return (
          <CustomSectionBlock
            key={section.key}
            sectionKey={section.key}
            locale={locale}
            titleZh={section.titleZh}
            titleEn={section.titleEn}
            subtitleZh={section.subtitleZh}
            subtitleEn={section.subtitleEn}
            contentZh={section.contentZh}
            contentEn={section.contentEn}
            imageUrl={section.imageUrl}
          />
        );
    }
  });

  return (
    <main className="bg-[#0A0806] min-h-screen">
      <Navbar
        locale={locale}
        logoUrl={logoUrl}
        gameNameZh={gameNameZh}
        gameNameEn={gameNameEn}
        navItems={navItems}
        customNavSections={customNavSections.map((s) => ({
          key: s.key,
          labelZh: s.titleZh || s.key,
          labelEn: s.titleEn || s.key,
        }))}
      />
      {renderedSections}
      <Footer
        locale={locale}
        iosLink={iosLink}
        androidLink={androidLink}
        socialLinks={socialLinks}
        logoUrl={logoUrl}
        gameNameZh={gameNameZh}
        gameNameEn={gameNameEn}
      />
    </main>
  );
}
