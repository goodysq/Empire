import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { toTraditional } from "@/lib/opencc";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function NewsListPage({ params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "zh" | "zh-TW" | "en")) {
    notFound();
  }

  const zh = locale !== "en";

  const articles = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const formatDate = (d: Date) => {
    if (locale === "en") {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const pageTitle =
    locale === "en" ? "Empire News" : locale === "zh-TW" ? "帝國資訊" : "帝国资讯";
  const backLabel =
    locale === "en" ? "Back to Home" : locale === "zh-TW" ? "返回主頁" : "返回主页";
  const emptyLabel =
    locale === "en" ? "No articles published yet." : locale === "zh-TW" ? "暫無已發布的文章。" : "暂无已发布的文章。";
  const categoryLabel =
    locale === "en" ? "Empire News" : locale === "zh-TW" ? "帝國資訊" : "帝国资讯";

  return (
    <div className="bg-[#0A0806] min-h-screen">
      <Navbar locale={locale} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link
            href={`/${locale}#news`}
            className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C96A] text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            {backLabel}
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
              <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase">
                {locale === "en" ? "Empire Updates" : locale === "zh-TW" ? "帝國動態" : "帝国动态"}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#F5EDD5]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent mb-10" />

          {/* Articles grid */}
          {articles.length === 0 ? (
            <p className="text-[#B8A882] text-center py-20">{emptyLabel}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => {
                const title =
                  locale === "en"
                    ? (article.titleEn ?? article.titleZh)
                    : toTraditional(article.titleZh, locale);
                const excerpt =
                  locale === "en"
                    ? (article.excerptEn ?? article.excerptZh)
                    : toTraditional(article.excerptZh, locale);
                const date = article.publishedAt ?? article.createdAt;

                return (
                  <Link
                    key={article.id}
                    href={`/${locale}/news/${article.id}`}
                    className="group block"
                  >
                    <div className="relative h-full rounded-xl overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 bg-gradient-to-b from-[#1A1510] to-[#0D0B07]">
                      {/* Cover image */}
                      {article.coverImage ? (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B07]/70 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-[#1A1510] to-[#0D0B07] flex items-center justify-center">
                          <span
                            className="text-5xl font-black text-[#C9A84C]/10"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            帝
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5">
                        {/* Meta */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
                            <Tag size={10} />
                            {categoryLabel}
                          </span>
                          <span className="flex items-center gap-1 text-[#B8A882]/60 text-xs">
                            <Calendar size={10} />
                            {formatDate(new Date(date))}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[#F5EDD5] font-bold text-base mb-2 line-clamp-2 group-hover:text-[#E8C96A] transition-colors duration-200">
                          {title}
                        </h2>

                        {/* Excerpt */}
                        {excerpt && (
                          <p className="text-[#B8A882] text-sm leading-relaxed line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
