"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { loc } from "@/lib/loc";

interface FeaturesSectionProps {
  locale: string;
}

const features = [
  {
    num: "01",
    titleZh: "强社交", titleTw: "強社交",
    titleEn: "Strong Social",
    subtitleZh: "联盟系统", subtitleTw: "聯盟系統",
    subtitleEn: "Alliance System",
    descZh: "与全球玩家组建强大联盟，共同制定战略，协同作战，在史诗级联盟战争中书写传奇。",
    descTw: "與全球玩家組建強大聯盟，共同制定戰略，協同作戰，在史詩級聯盟戰爭中書寫傳奇。",
    descEn: "Form powerful alliances with players worldwide, develop joint strategies, and fight together in epic alliance wars.",
    image: "/art/characters/亚历山大.png",
    color: "from-blue-500/20 to-blue-900/5",
    glowColor: "rgba(59,130,246,0.35)",
    accentColor: "#3B82F6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    num: "02",
    titleZh: "丰富英雄", titleTw: "豐富英雄",
    titleEn: "Rich Heroes",
    subtitleZh: "跨时空历史人物", subtitleTw: "跨時空歷史人物",
    subtitleEn: "Legends Across Time",
    descZh: "汇聚亚历山大、秦始皇、布迪卡等13位跨越时空的历史英雄，每位英雄拥有独特技能与专属故事。",
    descTw: "匯聚亞歷山大、秦始皇、布迪卡等13位跨越時空的歷史英雄，每位英雄擁有獨特技能與專屬故事。",
    descEn: "Command 13 legendary heroes including Alexander, Qin Shi Huang, and Boudica, each with unique skills and story.",
    image: "/art/characters/善德女王-女王.png",
    color: "from-[#C9A84C]/25 to-[#8B5E1A]/5",
    glowColor: "rgba(201,168,76,0.4)",
    accentColor: "#C9A84C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    num: "03",
    titleZh: "玩法减负", titleTw: "玩法減負",
    titleEn: "Gameplay Relief",
    subtitleZh: "协同发展", subtitleTw: "協同發展",
    subtitleEn: "Collaborative Growth",
    descZh: "智能辅助系统减少重复操作，让你专注于战略布局与英雄培养，享受纯粹的策略乐趣。",
    descTw: "智能輔助系統減少重複操作，讓你專注於戰略佈局與英雄培養，享受純粹的策略樂趣。",
    descEn: "Intelligent assistance reduces repetitive tasks so you can focus on strategy and hero development.",
    image: "/art/monsters/monster_convicts_elite2.png",
    color: "from-emerald-500/20 to-emerald-900/5",
    glowColor: "rgba(16,185,129,0.35)",
    accentColor: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    num: "04",
    titleZh: "赛季制", titleTw: "賽季制",
    titleEn: "Season System",
    subtitleZh: "赛季轮回", subtitleTw: "賽季輪回",
    subtitleEn: "Seasonal Cycles",
    descZh: "独特赛季机制确保每个赛季都有全新的战略格局，排行榜竞争激烈，让帝国征途永保新鲜感。",
    descTw: "獨特賽季機制確保每個賽季都有全新的戰略格局，排行榜競爭激烈，讓帝國征途永保新鮮感。",
    descEn: "Unique seasonal mechanics ensure fresh strategic landscapes each season with intense competition.",
    image: "/art/monsters/monster_heretics_boss1.png",
    color: "from-purple-500/20 to-purple-900/5",
    glowColor: "rgba(168,85,247,0.35)",
    accentColor: "#A855F7",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    num: "05",
    titleZh: "公平竞技", titleTw: "公平競技",
    titleEn: "Fair Competition",
    subtitleZh: "策略为王", subtitleTw: "策略為王",
    subtitleEn: "Strategy Reigns",
    descZh: "深度策略体系让智慧超越氪金，合理的资源分配让每位玩家都能凭借战略获得公平机会。",
    descTw: "深度策略體系讓智慧超越氪金，合理的資源分配讓每位玩家都能憑藉戰略獲得公平機會。",
    descEn: "Deep strategic systems where wisdom trumps spending. Fair resource allocation for equal competition.",
    image: "/art/monsters/monster_convicts_boss1.png",
    color: "from-rose-500/20 to-rose-900/5",
    glowColor: "rgba(244,63,94,0.35)",
    accentColor: "#F43F5E",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99.203 1.99.377 3 .52m0 0l2.62 10.726c.122.499-.106 1.028-.59 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
];

export default function FeaturesSection({ locale }: FeaturesSectionProps) {
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const zh = locale !== "en";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#0D0B07] to-[#0A0806]" />

      {/* Alliance hall background — very subtle */}
      <div className="absolute inset-0 opacity-[0.06]">
        <Image
          src="/art/alliance/联盟主界面-欧洲.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-40 bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

      {/* Floating monster silhouettes — decorative */}
      <div className="absolute left-0 bottom-0 w-64 h-64 opacity-[0.06] pointer-events-none">
        <Image src="/art/monsters/monster_rebelsl_normal2.png" alt="" fill className="object-contain object-bottom-left" />
      </div>
      <div className="absolute right-0 top-1/4 w-56 h-56 opacity-[0.07] pointer-events-none">
        <Image src="/art/monsters/monster_convicts_boss2.png" alt="" fill className="object-contain object-right" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase">
              {loc(locale, "核心优势", "核心優勢", "Core Advantages")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5] mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {loc(locale, "游戏特色", "遊戲特色", "Game Features")}
          </h2>
          <p className="text-[#B8A882] text-lg max-w-2xl mx-auto">
            {loc(locale, "五大核心优势，打造极致帝国体验", "五大核心優勢，打造極致帝國體驗", "Five core advantages for the ultimate empire experience")}
          </p>
        </div>

        {/* Feature cards — 5 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-14"
              }`}
              style={{ transitionDelay: `${idx * 120}ms` }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className="relative h-full rounded-xl border border-[#C9A84C]/15 bg-[#0D0B07] overflow-hidden transition-all duration-400 hover:-translate-y-2"
                style={{
                  boxShadow:
                    hoveredIdx === idx
                      ? `0 0 40px ${feature.glowColor}, 0 20px 60px rgba(0,0,0,0.6)`
                      : "0 4px 24px rgba(0,0,0,0.4)",
                  borderColor:
                    hoveredIdx === idx ? `${feature.accentColor}50` : undefined,
                  transition: "box-shadow 0.35s, border-color 0.35s, transform 0.35s",
                }}
              >
                {/* Character / monster image — reveals on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: hoveredIdx === idx ? 0.18 : 0.06 }}
                >
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B07] via-[#0D0B07]/60 to-transparent" />
                </div>

                {/* Color gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} transition-opacity duration-400`}
                  style={{ opacity: hoveredIdx === idx ? 1 : 0.3 }}
                />

                {/* Scan line on hover */}
                {hoveredIdx === idx && (
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                    style={{ zIndex: 5 }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${feature.accentColor}80, transparent)`,
                        animation: "scanLine 1.2s ease-in-out infinite",
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative p-5 z-10">
                  {/* Number badge */}
                  <div
                    className="text-[2.8rem] font-black leading-none mb-3 select-none transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      color:
                        hoveredIdx === idx
                          ? `${feature.accentColor}90`
                          : "rgba(201,168,76,0.12)",
                      textShadow:
                        hoveredIdx === idx
                          ? `0 0 20px ${feature.accentColor}40`
                          : "none",
                    }}
                  >
                    {feature.num}
                  </div>

                  {/* Icon */}
                  <div className="mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{
                        background:
                          hoveredIdx === idx
                            ? `${feature.accentColor}20`
                            : "rgba(201,168,76,0.08)",
                        border: `1px solid ${
                          hoveredIdx === idx
                            ? `${feature.accentColor}50`
                            : "rgba(201,168,76,0.25)"
                        }`,
                        color:
                          hoveredIdx === idx ? feature.accentColor : "#E8C96A",
                      }}
                    >
                      {feature.icon}
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className="font-bold text-lg mb-0.5 transition-colors duration-300"
                    style={{
                      color: hoveredIdx === idx ? feature.accentColor : "#E8C96A",
                    }}
                  >
                    {loc(locale, feature.titleZh, feature.titleTw, feature.titleEn)}
                  </div>
                  <div className="text-[#C9A84C]/60 text-xs mb-3 font-medium uppercase tracking-wider">
                    {loc(locale, feature.subtitleZh, feature.subtitleTw, feature.subtitleEn)}
                  </div>
                  <p className="text-[#B8A882]/80 text-sm leading-relaxed">
                    {loc(locale, feature.descZh, feature.descTw, feature.descEn)}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-400"
                  style={{
                    background:
                      hoveredIdx === idx
                        ? `linear-gradient(90deg, transparent, ${feature.accentColor}, transparent)`
                        : "transparent",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan line keyframes */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
