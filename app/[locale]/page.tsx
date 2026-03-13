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
  const [heroes, news, allSettings] = await Promise.all([
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
  ]);

  const gs = (key: string) => allSettings.find((s) => s.key === key)?.value ?? "";

  const iosLink = gs("ios_link");
  const androidLink = gs("android_link");

  const socialLinks = {
    weibo: gs("weibo_url") || undefined,
    wechat: gs("wechat_id") || undefined,
    tiktok: gs("tiktok_url") || undefined,
    youtube: gs("youtube_url") || undefined,
    twitter: gs("twitter_url") || undefined,
    discord: gs("discord_url") || undefined,
    telegram: gs("telegram_url") || undefined,
  };

  const supportLinks = {
    privacy: gs("privacy_url") || undefined,
    terms: gs("terms_url") || undefined,
    contact: gs("contact_url") || undefined,
    faq: gs("faq_url") || undefined,
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
      <Navbar locale={locale} />
      <HeroSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <FeaturesSection locale={locale} />
      <HeroesGallery locale={locale} heroes={heroes} />
      <WorldSection locale={locale} />
      <NewsSection locale={locale} news={convertedNews} />
      <DownloadSection locale={locale} iosLink={iosLink} androidLink={androidLink} />
      <Footer locale={locale} iosLink={iosLink} androidLink={androidLink} socialLinks={socialLinks} supportLinks={supportLinks} />
    </main>
  );
}
