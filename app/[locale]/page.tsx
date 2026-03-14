import Navbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import FeaturesSection from "@/components/website/FeaturesSection";
import HeroesGallery from "@/components/website/HeroesGallery";
import WorldSection from "@/components/website/WorldSection";
import NewsSection from "@/components/website/NewsSection";
import DownloadSection from "@/components/website/DownloadSection";
import GuidesSection from "@/components/website/GuidesSection";
import ReservationSection from "@/components/website/ReservationSection";
import CustomSectionBlock from "@/components/website/CustomSectionBlock";
import Footer from "@/components/website/Footer";
import { prisma } from "@/lib/db";
import { toTraditional } from "@/lib/opencc";
import type { SiteSetting, PageSection, News, Guide } from "@/lib/generated/prisma/client";

// System section keys — have dedicated components
const SYSTEM_KEYS = new Set([
  "hero", "features", "heroes_gallery", "world", "news", "guides", "download",
  "reservation",
  "support_privacy", "support_terms", "support_contact", "support_faq",
]);

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [heroes, news, allSettings, allSections, navItems, guides, guidesSection] =
    await Promise.all([
      prisma.hero.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      prisma.news.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.siteSetting.findMany(),
      prisma.pageSection.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      prisma.navItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      prisma.guide.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      prisma.pageSection.findUnique({ where: { key: "guides" } }),
    ]);

  const gs = (key: string) => allSettings.find((s: SiteSetting) => s.key === key)?.value ?? "";

  const iosLink = gs("ios_link");
  const androidLink = gs("android_link");
  const logoUrl = gs("logo_url");
  const gameNameZh = toTraditional(gs("game_name_zh"), locale);
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

  const customNavSections = allSections.filter(
    (s: PageSection) => !SYSTEM_KEYS.has(s.key) && s.showInNav
  );

  const convertedNews =
    locale === "zh-TW"
      ? news.map((n: News) => ({
          ...n,
          titleZh: toTraditional(n.titleZh, locale),
          excerptZh: toTraditional(n.excerptZh, locale),
        }))
      : news;

  const convertedGuides =
    locale === "zh-TW"
      ? guides.map((g: Guide) => ({
          ...g,
          titleZh: toTraditional(g.titleZh, locale),
          excerptZh: toTraditional(g.excerptZh ?? "", locale),
          category: toTraditional(g.category ?? "", locale),
        }))
      : guides;

  // All sections ordered by DB; system keys map to their components
  const renderedSections = allSections.map((section: PageSection) => {

    switch (section.key) {
      case "hero":
        return <HeroSection key="hero" locale={locale} iosLink={iosLink} androidLink={androidLink} gameNameZh={gameNameZh} gameNameEn={gameNameEn} heroes={heroes} />;
      case "features":
        return <FeaturesSection key="features" locale={locale} />;
      case "heroes_gallery":
        return <HeroesGallery key="heroes_gallery" locale={locale} heroes={heroes} />;
      case "world":
        return <WorldSection key="world" locale={locale} />;
      case "news":
        return <NewsSection key="news" locale={locale} news={convertedNews} />;
      case "guides":
        // Only render if there are guides
        return convertedGuides.length > 0 ? (
          <GuidesSection
            key="guides"
            locale={locale}
            guides={convertedGuides}
            titleZh={guidesSection?.titleZh ?? undefined}
            titleEn={guidesSection?.titleEn ?? undefined}
            subtitleZh={guidesSection?.subtitleZh ?? undefined}
            subtitleEn={guidesSection?.subtitleEn ?? undefined}
          />
        ) : null;
      case "reservation":
        return <ReservationSection key="reservation" locale={locale} />;
      case "download":
        return <DownloadSection key="download" locale={locale} iosLink={iosLink} androidLink={androidLink} />;
      default:
        if (section.key.startsWith("support_")) return null;
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
        customNavSections={customNavSections.map((s: PageSection) => ({
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
