"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { loc } from "@/lib/loc";

// DB news shape passed from server component
interface DbNews {
  id: string;
  titleZh: string;
  titleEn?: string | null;
  excerptZh?: string | null;
  excerptEn?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
}

// Internal shape used by the section
interface NewsItem {
  id: string | number;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  date: string;
  gradient: string;
  accentColor: string;
  coverImage?: string | null;
}

interface NewsSectionProps {
  locale: string;
  news?: DbNews[];
}

// Visual styles cycled by index
const NEWS_STYLES = [
  { gradient: "from-blue-900/80 via-indigo-900/60 to-purple-900/80", accentColor: "#6366F1" },
  { gradient: "from-amber-900/80 via-orange-900/60 to-red-900/80",   accentColor: "#F59E0B" },
  { gradient: "from-teal-900/80 via-cyan-900/60 to-blue-900/80",     accentColor: "#14B8A6" },
];

// Static fallback (used when DB has no published news)
const STATIC_NEWS: NewsItem[] = [
  {
    id: 1,
    titleZh: "1.5版本更新：全新英雄「托米里斯」震撼登场",
    titleEn: "Version 1.5 Update: New Hero 'Tomyris' Makes Grand Debut",
    excerptZh: "全新女王英雄托米里斯携带独特的骑射技能加入战场，同时带来全面优化的战斗系统与全新的赛季玩法。",
    excerptEn: "The new queen hero Tomyris joins the battlefield with unique mounted archery skills, along with a fully optimized combat system and new seasonal gameplay.",
    date: "2024-03-15",
    gradient: "from-blue-900/80 via-indigo-900/60 to-purple-900/80",
    accentColor: "#6366F1",
  },
  {
    id: 2,
    titleZh: "春季联盟战争活动：百万奖励等你来拿",
    titleEn: "Spring Alliance War Event: Million Rewards Await",
    excerptZh: "春季限定联盟战争活动正式开启，参与排名前三的联盟将获得独家英雄皮肤与海量资源奖励。",
    excerptEn: "The spring limited alliance war event is now open. The top three ranked alliances will receive exclusive hero skins and massive resource rewards.",
    date: "2024-03-10",
    gradient: "from-amber-900/80 via-orange-900/60 to-red-900/80",
    accentColor: "#F59E0B",
  },
  {
    id: 3,
    titleZh: "世界观解析：亚特兰蒂斯文明的消失之谜",
    titleEn: "Lore Deep Dive: The Mystery of Atlantis Civilization's Disappearance",
    excerptZh: "探索帝国纪元世界中亚特兰蒂斯文明的起源与消亡，揭开这片神秘大陆背后隐藏的史诗故事。",
    excerptEn: "Explore the origin and fall of Atlantis civilization in Empire Chronicles, uncovering the epic story hidden behind this mysterious continent.",
    date: "2024-03-05",
    gradient: "from-teal-900/80 via-cyan-900/60 to-blue-900/80",
    accentColor: "#14B8A6",
  },
];

export default function NewsSection({ locale, news: dbNews }: NewsSectionProps) {
  const router = useRouter();

  // Map DB news to internal shape, fall back to static if DB is empty
  const newsData: NewsItem[] =
    dbNews && dbNews.length > 0
      ? dbNews.map((n, i) => ({
          id: n.id,
          titleZh: n.titleZh,
          titleEn: n.titleEn ?? n.titleZh,
          excerptZh: n.excerptZh ?? "",
          excerptEn: n.excerptEn ?? n.excerptZh ?? "",
          coverImage: n.coverImage ?? null,
          date: n.publishedAt
            ? new Date(n.publishedAt).toISOString().slice(0, 10)
            : n.createdAt
            ? new Date(n.createdAt).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          ...NEWS_STYLES[i % NEWS_STYLES.length],
        }))
      : STATIC_NEWS;

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const zh = locale !== "en";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (zh) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] to-[#0D0B07]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase">
              {loc(locale, "帝国动态", "帝國動態", "Empire News")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5] mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {loc(locale, "最新资讯", "最新資訊", "Latest News")}
          </h2>
          <p className="text-[#B8A882] text-lg">
            {loc(locale, "帝国动态，实时更新", "帝國動態，即時更新", "Empire Updates, Real-time Information")}
          </p>
        </div>

        {/* News cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.map((news, idx) => {
            const isDbArticle = typeof news.id === "string";
            const handleClick = isDbArticle
              ? () => router.push(`/${locale}/news/${news.id}`)
              : undefined;
            return (
              <div
                key={news.id}
                onClick={handleClick}
                className={`group transition-all duration-700 ${
                  isDbArticle ? "cursor-pointer" : ""
                } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className="relative h-full rounded-xl overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                  {/* Cover image / gradient */}
                  <div className={`relative h-48 bg-gradient-to-br ${news.gradient} overflow-hidden`}>
                    {/* Actual cover image — shown when available */}
                    {news.coverImage && (
                      <img
                        src={news.coverImage}
                        alt={zh ? news.titleZh : news.titleEn}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Decorative overlay (only when no cover image) */}
                    {!news.coverImage && (
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-32 h-32 rounded-full border border-white/20" />
                        <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full border border-white/10" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-white/10"
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          {idx === 0 ? "I" : idx === 1 ? "II" : "III"}
                        </div>
                      </div>
                    )}
                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                      style={{ background: `linear-gradient(to right, transparent, ${news.accentColor}, transparent)` }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 bg-gradient-to-b from-[#1A1510] to-[#0D0B07]">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30">
                        <Tag size={10} />
                        {loc(locale, "帝国资讯", "帝國資訊", "Empire News")}
                      </span>
                      <span className="flex items-center gap-1 text-[#B8A882]/60 text-xs">
                        <Calendar size={10} />
                        {formatDate(news.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#F5EDD5] font-bold text-base mb-2 line-clamp-2 group-hover:text-[#E8C96A] transition-colors duration-200">
                      {zh ? news.titleZh : news.titleEn}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[#B8A882] text-sm leading-relaxed line-clamp-3 mb-4">
                      {zh ? news.excerptZh : news.excerptEn}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-1 text-[#C9A84C] text-sm font-medium group-hover:gap-2 transition-all duration-200">
                      <span>{loc(locale, "阅读更多", "閱讀更多", "Read More")}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View more button */}
        <div
          className={`text-center mt-10 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={() => router.push(`/${locale}/news`)}
            className="group relative px-8 py-3 border border-[#C9A84C]/40 text-[#C9A84C] rounded font-medium text-sm overflow-hidden transition-all hover:border-[#E8C96A] hover:shadow-lg hover:shadow-[#C9A84C]/20"
          >
            <span className="relative z-10">{loc(locale, "查看更多资讯", "查看更多資訊", "View More News")}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/0 via-[#C9A84C]/10 to-[#C9A84C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}
