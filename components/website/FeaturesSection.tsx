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
    accentColor: "#3B82F6",
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
    accentColor: "#C9A84C",
  },
  {
    num: "03",
    titleZh: "赛季制", titleTw: "賽季制",
    titleEn: "Season System",
    subtitleZh: "赛季轮回", subtitleTw: "賽季輪回",
    subtitleEn: "Seasonal Cycles",
    descZh: "独特赛季机制确保每个赛季都有全新的战略格局，排行榜竞争激烈，让帝国征途永保新鲜感。",
    descTw: "獨特賽季機制確保每個賽季都有全新的戰略格局，排行榜競爭激烈，讓帝國征途永保新鮮感。",
    descEn: "Unique seasonal mechanics ensure fresh strategic landscapes each season with intense competition.",
    image: "/art/monsters/monster_heretics_boss1.png",
    accentColor: "#A855F7",
  },
  {
    num: "04",
    titleZh: "公平竞技", titleTw: "公平競技",
    titleEn: "Fair Competition",
    subtitleZh: "策略为王", subtitleTw: "策略為王",
    subtitleEn: "Strategy Reigns",
    descZh: "深度策略体系让智慧超越氪金，合理的资源分配让每位玩家都能凭借战略获得公平机会。",
    descTw: "深度策略體系讓智慧超越氪金，合理的資源分配讓每位玩家都能憑藉戰略獲得公平機會。",
    descEn: "Deep strategic systems where wisdom trumps spending. Fair resource allocation for equal competition.",
    image: "/art/monsters/monster_convicts_boss1.png",
    accentColor: "#F43F5E",
  },
];

export default function FeaturesSection({ locale }: FeaturesSectionProps) {
  const [activePanel, setActivePanel] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );

  const wrapperRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Show/hide fixed progress indicator when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Track which panel is centered — drives progress indicator active state
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    panelRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActivePanel(idx); },
        { threshold: 0.5 }
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Panel entry animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    panelRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiblePanels((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section id="features" ref={wrapperRef}>
      {/* Fixed progress indicator — desktop only, visible when section is in view */}
      {sectionVisible && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-2">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() =>
                panelRefs.current[idx]?.scrollIntoView({ behavior: "smooth" })
              }
              aria-label={`Go to feature ${feature.num}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === activePanel ? "6px" : "5px",
                height: idx === activePanel ? "32px" : "12px",
                background:
                  idx === activePanel
                    ? feature.accentColor
                    : "rgba(201,168,76,0.3)",
              }}
            />
          ))}
        </div>
      )}

      {/* Feature panels */}
      {features.map((feature, idx) => (
        <div
          key={idx}
          ref={(el) => { panelRefs.current[idx] = el; }}
          className="relative w-full overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Background image — or dark gradient placeholder if image is missing */}
          {feature.image ? (
            <Image
              src={feature.image}
              alt=""
              fill
              className="object-cover object-center"
              style={{ filter: "brightness(0.3) saturate(1.2)" }}
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D0B07] to-[#0A0806]" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/90 via-[#0A0806]/50 to-[#0A0806]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/70 via-transparent to-[#0A0806]/30" />

          {/* Content — desktop: left 40%, mobile: full width bottom-aligned */}
          <div
            className={`relative z-10 h-full flex flex-col justify-center
              px-8 sm:px-16 lg:px-24 xl:px-32
              transition-all duration-700
              ${visiblePanels[idx] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <div className="max-w-lg lg:max-w-[45%]">
              {/* Number badge */}
              <div
                className="text-[6rem] sm:text-[8rem] font-black leading-none mb-2 select-none"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  color: "transparent",
                  WebkitTextStroke: `1px ${feature.accentColor}35`,
                }}
              >
                {feature.num}
              </div>

              {/* Title */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {loc(locale, feature.titleZh, feature.titleTw, feature.titleEn)}
              </h2>

              {/* Colored subtitle */}
              <div
                className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
                style={{ color: feature.accentColor }}
              >
                {loc(locale, feature.subtitleZh, feature.subtitleTw, feature.subtitleEn)}
              </div>

              {/* Accent line */}
              <div
                className="h-0.5 w-16 mb-6"
                style={{
                  background: `linear-gradient(to right, ${feature.accentColor}, transparent)`,
                }}
              />

              {/* Description */}
              <p className="text-[#F5EDD5]/75 text-base sm:text-lg leading-relaxed">
                {loc(locale, feature.descZh, feature.descTw, feature.descEn)}
              </p>
            </div>
          </div>

          {/* Mobile dot indicators — shown instead of fixed progress bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 lg:hidden">
            {features.map((f, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() =>
                  panelRefs.current[dotIdx]?.scrollIntoView({ behavior: "smooth" })
                }
                aria-label={`Go to feature ${f.num}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: dotIdx === activePanel ? "32px" : "8px",
                  height: "8px",
                  background:
                    dotIdx === activePanel
                      ? features[dotIdx].accentColor
                      : "rgba(201,168,76,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
