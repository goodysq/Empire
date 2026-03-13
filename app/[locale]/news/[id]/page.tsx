import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { BackButton } from "@/components/website/BackButton";
import { toTraditional } from "@/lib/opencc";
import { sanitize } from "@/lib/sanitize";
import { Calendar, Tag } from "lucide-react";
import type { SiteSetting } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const zh = locale !== "en";

  const [article, allSettings] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.siteSetting.findMany(),
  ]);

  if (!article || !article.isPublished) notFound();

  const gs = (key: string) => allSettings.find((s: SiteSetting) => s.key === key)?.value ?? "";
  const logoUrl = gs("logo_url");
  const gameNameZh = gs("game_name_zh");
  const gameNameEn = gs("game_name_en");

  const title =
    locale === "en"
      ? (article.titleEn ?? article.titleZh)
      : toTraditional(article.titleZh, locale); // zh-TW → Traditional, zh → unchanged

  const content =
    locale === "en"
      ? (article.contentEn ?? article.contentZh)
      : toTraditional(article.contentZh, locale);
  const date = article.publishedAt ?? article.createdAt;

  const formatDate = (d: Date) => {
    if (locale === "zh") {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    if (locale === "zh-TW") {
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const backLabel = locale === "en" ? "Back to News" : locale === "zh-TW" ? "返回資訊" : "返回资讯";
  const categoryLabel = locale === "en" ? "Empire News" : locale === "zh-TW" ? "帝國資訊" : "帝国资讯";

  return (
    <div className="bg-[#0A0806] min-h-screen">
      <Navbar locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <BackButton label={backLabel} href={`/${locale}/news`} />

          {/* Cover image */}
          {article.coverImage && (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8 border border-[#C9A84C]/20">
              <img
                src={article.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/60 to-transparent" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
              <Tag size={10} />
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[#B8A882]/70 text-sm">
              <Calendar size={13} />
              {formatDate(new Date(date))}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#F5EDD5] mb-8 leading-tight"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {title}
          </h1>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent mb-8" />

          {/* Article Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: sanitize(content) }}
          />

          {/* Bottom divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mt-12 mb-8" />

          {/* Back button */}
          <BackButton label={backLabel} variant="outlined" href={`/${locale}/news`} />
        </div>
      </main>

      <Footer locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />
    </div>
  );
}
