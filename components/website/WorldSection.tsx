"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { loc } from "@/lib/loc";

interface WorldSectionProps {
  locale: string;
}

const regions = [
  {
    key: "eastasia",
    labelZh: "东亚", labelTw: "東亞",
    labelEn: "East Asia",
    image: "/art/alliance/联盟主界面-东亚.png",
    descZh: "巍峨的东方帝国，秦汉文明的发源地。宏伟的长城横亘千里，蜿蜒的运河连通南北。这片土地孕育了无数英雄豪杰，等待你来率领他们建立不朽功业。",
    descTw: "巍峨的東方帝國，秦漢文明的發源地。宏偉的長城橫亙千里，蜿蜒的運河連通南北。這片土地孕育了無數英雄豪傑，等待你來率領他們建立不朽功業。",
    descEn: "The majestic eastern empire, birthplace of Qin and Han civilizations. The Great Wall stretches thousands of miles. This land has nurtured countless heroes waiting for you to lead them to immortal glory.",
    accent: "#E8C96A",
  },
  {
    key: "europe",
    labelZh: "欧洲", labelTw: "歐洲",
    labelEn: "Europe",
    image: "/art/alliance/联盟主界面-欧洲.png",
    descZh: "古希腊与罗马的荣光在此延续，凯尔特勇士与维京海盗在这片土地上留下了永恒的传说。组建你的欧洲联盟，征服这片孕育了无数伟大文明的土地。",
    descTw: "古希臘與羅馬的榮光在此延續，凱爾特勇士與維京海盜在這片土地上留下了永恆的傳說。組建你的歐洲聯盟，征服這片孕育了無數偉大文明的土地。",
    descEn: "The glory of ancient Greece and Rome continues here, where Celtic warriors and Viking raiders have left eternal legends. Form your European alliance and conquer this cradle of great civilizations.",
    accent: "#A8C8E8",
  },
  {
    key: "middleeast",
    labelZh: "中东", labelTw: "中東",
    labelEn: "Middle East",
    image: "/art/alliance/联盟主界面-中东.png",
    descZh: "美索不达米亚的肥沃新月地带，丝绸之路的十字路口。波斯帝国的辉煌与迦太基的海上霸权在此交汇，等待新的征服者书写新的历史。",
    descTw: "美索不達米亞的肥沃新月地帶，絲綢之路的十字路口。波斯帝國的輝煌與迦太基的海上霸權在此交匯，等待新的征服者書寫新的歷史。",
    descEn: "The fertile crescent of Mesopotamia, crossroads of the Silk Road. The splendor of the Persian Empire and the maritime dominance of Carthage converge here, awaiting new conquerors.",
    accent: "#E8A84C",
  },
  {
    key: "atlantis",
    labelZh: "亚特兰蒂斯", labelTw: "亞特蘭提斯",
    labelEn: "Atlantis",
    image: "/art/alliance/联盟主界面-亚特兰蒂斯.png",
    descZh: "传说中消失的神秘大陆重现于世，古老的魔法与失落的科技在此共存。探索这片未知的疆域，发现前所未有的宝藏与挑战，书写帝国最辉煌的篇章。",
    descTw: "傳說中消失的神秘大陸重現於世，古老的魔法與失落的科技在此共存。探索這片未知的疆域，發現前所未有的寶藏與挑戰，書寫帝國最輝煌的篇章。",
    descEn: "The legendary lost continent has reappeared, where ancient magic and lost technology coexist. Explore this unknown territory, discover unprecedented treasures and write the most glorious chapter of your empire.",
    accent: "#84E8C8",
  },
];

export default function WorldSection({ locale }: WorldSectionProps) {
  const [activeRegion, setActiveRegion] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
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

  const switchRegion = (idx: number) => {
    if (idx === activeRegion) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveRegion(idx);
      setTransitioning(false);
    }, 400);
  };

  const current = regions[activeRegion];

  return (
    <section
      ref={sectionRef}
      id="world"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0806]" />
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
              {loc(locale, "文明", "文明", "Civilizations")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5] mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {loc(locale, "联盟世界", "聯盟世界", "Alliance World")}
          </h2>
          <p className="text-[#B8A882] text-lg">
            {loc(locale, "四大文明圈，史诗战场", "四大文明圈，史詩戰場", "Four Civilizations, Epic Battlefields")}
          </p>
        </div>

        {/* Region tabs */}
        <div
          className={`flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {regions.map((region, idx) => (
            <button
              key={region.key}
              onClick={() => switchRegion(idx)}
              className={`relative px-5 py-3 rounded text-sm font-medium transition-all duration-300 ${
                activeRegion === idx
                  ? "text-[#0A0806]"
                  : "border border-[#C9A84C]/30 text-[#B8A882] hover:border-[#C9A84C]/60 hover:text-[#E8C96A]"
              }`}
              style={
                activeRegion === idx
                  ? {
                      background: `linear-gradient(to right, #C9A84C, #E8C96A)`,
                      boxShadow: `0 0 20px rgba(201, 168, 76, 0.4)`,
                    }
                  : {}
              }
            >
              {loc(locale, region.labelZh, region.labelTw, region.labelEn)}
              {activeRegion === idx && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#E8C96A] rotate-45" />
              )}
            </button>
          ))}
        </div>

        {/* Image + description */}
        <div
          className={`relative rounded-xl overflow-hidden transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Image container */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
            <div
              className={`absolute inset-0 transition-opacity duration-400 ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <Image
                src={current.image}
                alt={loc(locale, current.labelZh, current.labelTw, current.labelEn)}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/80 via-[#0A0806]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/60 via-transparent to-transparent" />

            {/* Content overlay */}
            <div
              className={`absolute inset-0 flex items-center px-8 sm:px-12 lg:px-16 transition-all duration-400 ${
                transitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              }`}
            >
              <div className="max-w-lg">
                <div
                  className="text-3xl sm:text-4xl font-bold mb-3"
                  style={{
                    color: current.accent,
                    fontFamily: "var(--font-cinzel)",
                    textShadow: `0 0 30px ${current.accent}40`,
                  }}
                >
                  {loc(locale, current.labelZh, current.labelTw, current.labelEn)}
                </div>
                <div className="h-0.5 w-16 mb-4" style={{ background: current.accent }} />
                <p className="text-[#F5EDD5]/80 text-sm sm:text-base leading-relaxed">
                  {loc(locale, current.descZh, current.descTw, current.descEn)}
                </p>
              </div>
            </div>
          </div>

          {/* Border */}
          <div
            className="absolute inset-0 rounded-xl border pointer-events-none"
            style={{ borderColor: `${current.accent}30` }}
          />
        </div>

        {/* Region indicators */}
        <div className="flex justify-center gap-3 mt-6">
          {regions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => switchRegion(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeRegion
                  ? "w-8 h-2 bg-[#E8C96A]"
                  : "w-2 h-2 bg-[#C9A84C]/30 hover:bg-[#C9A84C]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
