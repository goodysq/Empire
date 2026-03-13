"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Tag } from "lucide-react";

interface Guide {
  id: string;
  titleZh: string;
  titleEn?: string | null;
  excerptZh?: string | null;
  excerptEn?: string | null;
  coverImage?: string | null;
  category?: string | null;
  isVisible: boolean;
  order: number;
}

interface GuidesSectionProps {
  locale: string;
  guides: Guide[];
  titleZh?: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "新手入门":  { bg: "bg-green-500/20",  text: "text-green-300",  border: "border-green-500/30" },
  "英雄攻略":  { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30" },
  "战斗技巧":  { bg: "bg-red-500/20",    text: "text-red-300",    border: "border-red-500/30" },
  "联盟策略":  { bg: "bg-blue-500/20",   text: "text-blue-300",   border: "border-blue-500/30" },
  "资源管理":  { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" },
  "活动攻略":  { bg: "bg-pink-500/20",   text: "text-pink-300",   border: "border-pink-500/30" },
};
const defaultCat = { bg: "bg-[#C9A84C]/20", text: "text-[#C9A84C]", border: "border-[#C9A84C]/30" };

function GuideCard({ guide, locale, index }: { guide: Guide; locale: string; index: number }) {
  const isEn = locale === "en";
  const title = isEn ? (guide.titleEn || guide.titleZh) : guide.titleZh;
  const excerpt = isEn ? (guide.excerptEn || guide.excerptZh) : guide.excerptZh;
  const cat = guide.category ? (CAT_COLORS[guide.category] ?? defaultCat) : null;

  return (
    <Link
      href={`/${locale}/guides/${guide.id}`}
      className="group relative rounded-2xl overflow-hidden bg-[#111318] border border-gray-800/60 hover:border-[#C9A84C]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A84C]/10 block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1a1510] to-[#0d0b08]">
        {guide.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guide.coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <BookOpen size={28} className="text-[#C9A84C]/60" />
            </div>
          </div>
        )}

        {/* Category badge */}
        {cat && guide.category && (
          <div className="absolute top-3 left-3">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${cat.bg} ${cat.text} ${cat.border}`}>
              <Tag size={10} />
              {guide.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[#F5EDD5] font-bold text-base leading-snug mb-2 group-hover:text-[#E8C96A] transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-[#8B8070] text-sm leading-relaxed line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-[#C9A84C] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
          <span>{locale === "en" ? "Read Guide" : "查看攻略"}</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Gold shimmer on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.04) 100%)" }}
      />
    </Link>
  );
}

export default function GuidesSection({
  locale,
  guides,
  titleZh,
  titleEn,
  subtitleZh,
  subtitleEn,
}: GuidesSectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isEn = locale === "en";
  const title = isEn ? (titleEn || "Game Guides") : (titleZh || "攻略中心");
  const subtitle = isEn
    ? (subtitleEn || "Master every aspect of the game")
    : (subtitleZh || "从入门到精通，全面掌握游戏技巧");

  const visibleGuides = guides.filter((g) => g.isVisible);
  if (visibleGuides.length === 0) return null;

  return (
    <section id="guides" ref={ref} className="relative py-20 lg:py-28 bg-[#0A0806] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-64 h-64 -translate-y-1/2 bg-[#C9A84C]/3 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-64 h-64 -translate-y-1/2 bg-[#8B5E1A]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase flex items-center gap-1.5">
              <BookOpen size={13} />
              {isEn ? "Guides" : "游戏攻略"}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5] mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {title}
          </h2>
          <p className="text-[#B8A882] text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Guide cards grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {visibleGuides.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} locale={locale} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
