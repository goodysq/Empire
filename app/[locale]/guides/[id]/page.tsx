import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { BackButton } from "@/components/website/BackButton";
import { toTraditional } from "@/lib/opencc";
import { Tag, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function GuideDetailPage({ params }: Props) {
  const { locale, id } = await params;

  const [guide, allSettings] = await Promise.all([
    prisma.guide.findUnique({ where: { id } }),
    prisma.siteSetting.findMany(),
  ]);

  if (!guide || !guide.isVisible) notFound();

  const gs = (key: string) => allSettings.find((s) => s.key === key)?.value ?? "";
  const logoUrl = gs("logo_url");
  const gameNameZh = gs("game_name_zh");
  const gameNameEn = gs("game_name_en");

  const isEn = locale === "en";
  const title = isEn ? (guide.titleEn ?? guide.titleZh) : toTraditional(guide.titleZh, locale);
  const excerpt = isEn ? (guide.excerptEn ?? guide.excerptZh) : toTraditional(guide.excerptZh ?? "", locale);
  const content = isEn
    ? (guide.contentEn ?? guide.contentZh ?? "")
    : toTraditional(guide.contentZh ?? "", locale);
  const category = guide.category;

  const backLabel = isEn ? "Back to Guides" : locale === "zh-TW" ? "返回攻略" : "返回攻略";

  return (
    <div className="bg-[#0A0806] min-h-screen">
      <Navbar locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <BackButton label={backLabel} href={`/${locale}#guides`} />

          {/* Cover image */}
          {guide.coverImage && (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8 border border-[#C9A84C]/20">
              <img
                src={guide.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/60 to-transparent" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
                <Tag size={10} />
                {category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-[#C9A84C]/5 text-[#C9A84C]/70 border-[#C9A84C]/20">
              <BookOpen size={10} />
              {isEn ? "Game Guide" : "游戏攻略"}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#F5EDD5] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {title}
          </h1>

          {/* Excerpt as lead */}
          {excerpt && (
            <p className="text-[#B8A882] text-lg leading-relaxed mb-8 border-l-2 border-[#C9A84C]/40 pl-4">
              {excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent mb-8" />

          {/* Guide content */}
          {content ? (
            <div
              className="article-content text-[#B8A882] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="article-content text-[#B8A882] leading-relaxed">
              <p className="text-[#8B8070] italic text-center py-12">
                {isEn ? "Detailed guide content coming soon..." : "攻略详细内容即将发布..."}
              </p>
            </div>
          )}

          {/* Bottom divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mt-12 mb-8" />

          {/* Back button */}
          <BackButton label={backLabel} variant="outlined" href={`/${locale}#guides`} />
        </div>
      </main>

      <Footer locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />
    </div>
  );
}
