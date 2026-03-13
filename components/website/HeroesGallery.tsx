"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { loc } from "@/lib/loc";

// Normalized hero shape used internally by the carousel
interface HeroItem {
  nameZh: string;
  nameEn: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  image: string;
  faction: string;
}

// DB hero shape passed from the server component
interface DbHero {
  id?: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string | null;
  titleEn?: string | null;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl: string;
  faction?: string | null;
}

interface HeroesGalleryProps {
  locale: string;
  heroes?: DbHero[];
}

// Static fallback data (used when DB is empty or unavailable)
const STATIC_HEROES: HeroItem[] = [
  {
    nameZh: "亚历山大", nameEn: "Alexander",
    titleZh: "马其顿征服者", titleEn: "Macedonian Conqueror",
    descZh: "年仅32岁便征服已知世界的四分之三，被誉为人类历史上最伟大的军事天才。",
    descEn: "Conquered three-quarters of the known world by age 32 — history's greatest military genius.",
    image: "/art/characters/亚历山大.png", faction: "europe",
  },
  {
    nameZh: "秦始皇", nameEn: "Qin Shi Huang",
    titleZh: "千古一帝", titleEn: "First Emperor of China",
    descZh: "统一六国，书同文，车同轨，修建万里长城，奠定了两千年帝制中国的基础。",
    descEn: "Unified six warring states, standardized writing and roads, built the Great Wall to forge eternal China.",
    image: "/art/characters/秦始皇-临时.png", faction: "asia",
  },
  {
    nameZh: "布迪卡", nameEn: "Boudica",
    titleZh: "不列颠女王", titleEn: "Queen of Iceni",
    descZh: "率领不列颠部落奋起抗击罗马侵略者，重创罗马军团，成为英国历史上最传奇的女英雄。",
    descEn: "Led British tribes against Roman legions and devastated their forces — Britain's most legendary heroine.",
    image: "/art/characters/布迪卡-带英雄.png", faction: "europe",
  },
  {
    nameZh: "善德女王", nameEn: "Queen Seondeok",
    titleZh: "新罗女王", titleEn: "Queen of Silla",
    descZh: "朝鲜半岛首位女王，以智慧和外交手段巩固新罗王国，开创了文化与科学的黄金时代。",
    descEn: "Korea's first queen regnant, secured Silla through wisdom and diplomacy, ushering in a golden age.",
    image: "/art/characters/善德女王-女王.png", faction: "asia",
  },
  {
    nameZh: "华莱士", nameEn: "William Wallace",
    titleZh: "苏格兰守护者", titleEn: "Guardian of Scotland",
    descZh: "领导苏格兰人民对抗英格兰压迫，斯特林桥大捷令其威名远播，成为自由的永恒象征。",
    descEn: "Led Scotland's fight for freedom against English oppression, his victory at Stirling Bridge made him legend.",
    image: "/art/characters/华莱士.png", faction: "europe",
  },
  {
    nameZh: "吉尔伽美什", nameEn: "Gilgamesh",
    titleZh: "乌鲁克之王", titleEn: "King of Uruk",
    descZh: "人类文学史上最古老的英雄，两部分神半人之身，追求永生之旅成为流传千古的史诗。",
    descEn: "Humanity's oldest literary hero, two-thirds divine, whose quest for immortality became an eternal epic.",
    image: "/art/characters/吉尔伽-临时.png", faction: "middleeast",
  },
  {
    nameZh: "托米里斯", nameEn: "Tomyris",
    titleZh: "马萨革泰女王", titleEn: "Queen of Massagetae",
    descZh: "击败并斩杀波斯帝国缔造者居鲁士大帝，是古代世界中鲜有败绩的女性统帅。",
    descEn: "Defeated and slew Cyrus the Great of Persia — one of the ancient world's few undefeated women commanders.",
    image: "/art/characters/托米里斯.png", faction: "middleeast",
  },
  {
    nameZh: "特丽布瓦娜", nameEn: "Tribhuvana",
    titleZh: "满者伯夷女王", titleEn: "Queen of Majapahit",
    descZh: "将满者伯夷帝国扩张至东南亚最大疆域，其统治时代被誉为群岛文明的鼎盛时期。",
    descEn: "Expanded the Majapahit Empire to its greatest extent, her reign called the golden age of the archipelago.",
    image: "/art/characters/特丽布瓦娜.png", faction: "asia",
  },
  {
    nameZh: "狄多女王", nameEn: "Queen Dido",
    titleZh: "迦太基创始者", titleEn: "Founder of Carthage",
    descZh: "用一张牛皮之计获得土地，凭借绝世智慧建立了迦太基城，成为北非最强大的文明中心。",
    descEn: "Secured land through legendary cunning and founded Carthage, forging North Africa's greatest civilization.",
    image: "/art/characters/狄多女王-临时.png", faction: "middleeast",
  },
  {
    nameZh: "腓特烈", nameEn: "Frederick",
    titleZh: "神圣罗马皇帝", titleEn: "Holy Roman Emperor",
    descZh: "被称为\u300e世界奇迹\u300f，精通六国语言，以外交智慧不流血收复耶路撒冷，雄才大略震惊世人。",
    descEn: "Called 'Wonder of the World' — mastered six languages and recaptured Jerusalem through diplomacy alone.",
    image: "/art/characters/腓特烈-临时.png", faction: "europe",
  },
  {
    nameZh: "阿尔特米西亚", nameEn: "Artemisia",
    titleZh: "哈利卡纳苏斯女王", titleEn: "Queen of Halicarnassus",
    descZh: "波斯战争中唯一的女性海军指挥官，其在萨拉米斯海战中的英勇令薛西斯大帝由衷赞叹。",
    descEn: "The only female naval commander in the Persian Wars, her valor at Salamis drew praise from Xerxes himself.",
    image: "/art/characters/阿尔特米西亚.png", faction: "europe",
  },
  {
    nameZh: "丰臣秀吉", nameEn: "Toyotomi Hideyoshi",
    titleZh: "太阁", titleEn: "The Taiko",
    descZh: "从农民之子一跃成为统一日本的太政大臣，是日本历史上最传奇的草根逆袭故事。",
    descEn: "Rose from peasant origins to unify all of Japan as Regent — history's most legendary rags-to-ruler story.",
    image: "/art/characters/Y英雄-丰臣秀吉.png", faction: "asia",
  },
  {
    nameZh: "大卫王", nameEn: "King David",
    titleZh: "以色列之王", titleEn: "King of Israel",
    descZh: "少年时以一块石头击败巨人歌利亚，成年后建立以色列联合王国，诗篇至今传唱不息。",
    descEn: "Slew Goliath as a boy with a single stone, then built the united Kingdom of Israel whose psalms echo still.",
    image: "/art/characters/最新大卫王-临时.jpg", faction: "middleeast",
  },
];

type FilterType = "all" | "asia" | "europe" | "middleeast";

const filters: { key: FilterType; labelZh: string; labelTw: string; labelEn: string }[] = [
  { key: "all", labelZh: "全部", labelTw: "全部", labelEn: "All" },
  { key: "asia", labelZh: "亚洲", labelTw: "亞洲", labelEn: "Asia" },
  { key: "europe", labelZh: "欧洲", labelTw: "歐洲", labelEn: "Europe" },
  { key: "middleeast", labelZh: "中东", labelTw: "中東", labelEn: "Middle East" },
];

export default function HeroesGallery({ locale, heroes: dbHeroes }: HeroesGalleryProps) {
  // Map DB heroes to internal shape, fall back to static data if DB is empty
  const heroList: HeroItem[] =
    dbHeroes && dbHeroes.length > 0
      ? dbHeroes.map((h) => ({
          nameZh: h.nameZh,
          nameEn: h.nameEn,
          titleZh: h.titleZh ?? "",
          titleEn: h.titleEn ?? "",
          descZh: h.descZh ?? "",
          descEn: h.descEn ?? "",
          image: h.imageUrl,
          faction: h.faction ?? "asia",
        }))
      : STATIC_HEROES;

  const [filter, setFilter] = useState<FilterType>("all");
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const zh = locale !== "en";

  const filtered = filter === "all" ? heroList : heroList.filter((h) => h.faction === filter);
  const safeIdx = Math.min(activeIdx, filtered.length - 1);
  const current = filtered[safeIdx];
  const prevHero = prevIdx !== null ? filtered[Math.min(prevIdx, filtered.length - 1)] : null;

  const goTo = useCallback(
    (rawNewIdx: number, direction: 1 | -1) => {
      if (transitioning) return;
      const newIdx = ((rawNewIdx % filtered.length) + filtered.length) % filtered.length;
      if (newIdx === safeIdx) return;
      setDir(direction);
      setPrevIdx(safeIdx);
      setTransitioning(true);
      setActiveIdx(newIdx);
      // Scroll thumbnail strip horizontally — use container.scrollTo to avoid
      // triggering page-level vertical scroll that scrollIntoView can cause
      setTimeout(() => {
        const container = thumbsRef.current;
        const el = container?.children[newIdx] as HTMLElement | undefined;
        if (container && el) {
          const targetLeft =
            el.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2;
          container.scrollTo({ left: targetLeft, behavior: "smooth" });
        }
      }, 50);
      setTimeout(() => {
        setPrevIdx(null);
        setTransitioning(false);
      }, 550);
    },
    [transitioning, safeIdx, filtered.length]
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!visible) return;
    timerRef.current = setInterval(() => {
      goTo(safeIdx + 1, 1);
    }, 5000);
  }, [visible, safeIdx, goTo]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Reset on filter change
  useEffect(() => {
    setActiveIdx(0);
    setPrevIdx(null);
    setTransitioning(false);
  }, [filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const factionLabel = (faction: string) => {
    if (locale === "zh-TW") {
      return faction === "asia" ? "亞洲" : faction === "europe" ? "歐洲" : "中東";
    }
    if (locale !== "en") {
      return faction === "asia" ? "亚洲" : faction === "europe" ? "欧洲" : "中东";
    }
    return faction === "asia" ? "Asia" : faction === "europe" ? "Europe" : "Middle East";
  };

  return (
    <section
      ref={sectionRef}
      id="heroes"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#0D0B08] to-[#0A0806]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

      {/* CSS animations */}
      <style>{`
        @keyframes heroEnterRight {
          from { opacity: 0; transform: translateX(80px) scale(1.04); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes heroEnterLeft {
          from { opacity: 0; transform: translateX(-80px) scale(1.04); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes heroExitLeft {
          from { opacity: 1; transform: translateX(0)   scale(1); }
          to   { opacity: 0; transform: translateX(-80px) scale(0.97); }
        }
        @keyframes heroExitRight {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(80px) scale(0.97); }
        }
        @keyframes infoSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-enter-right { animation: heroEnterRight 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-enter-left  { animation: heroEnterLeft  0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-exit-left   { animation: heroExitLeft   0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .hero-exit-right  { animation: heroExitRight  0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .info-slide-up    { animation: infoSlideUp    0.45s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .thumb-scroll::-webkit-scrollbar { display: none; }
        .thumb-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase">
              {loc(locale, "英雄图鉴", "英雄圖鑑", "Hero Roster")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5] mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {loc(locale, "传奇英雄", "傳奇英雄", "Legendary Heroes")}
          </h2>
          <p className="text-[#B8A882] text-lg">
            {loc(locale, "跨越时空，群雄荟萃", "跨越時空，群雄薈萃", "Across Time, United in Glory")}
          </p>
        </div>

        {/* Filter tabs */}
        <div
          className={`flex justify-center gap-2 mb-8 flex-wrap transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                if (timerRef.current) clearInterval(timerRef.current);
              }}
              className={`px-6 py-2.5 rounded text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? "bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] shadow-lg shadow-[#C9A84C]/30"
                  : "border border-[#C9A84C]/30 text-[#B8A882] hover:border-[#C9A84C]/60 hover:text-[#E8C96A]"
              }`}
            >
              {loc(locale, f.labelZh, f.labelTw, f.labelEn)}
            </button>
          ))}
        </div>

        {/* Main showcase */}
        <div
          className={`transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Showcase card */}
          <div
            className="relative h-[420px] sm:h-[520px] lg:h-[620px] rounded-2xl overflow-hidden mb-5"
            style={{
              boxShadow:
                "0 0 0 1px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08), 0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Outgoing hero */}
            {prevHero && (
              <div
                key={`prev-${prevIdx}-${filter}`}
                className={`absolute inset-0 ${dir > 0 ? "hero-exit-left" : "hero-exit-right"}`}
              >
                <Image
                  src={prevHero.image}
                  alt={prevHero.nameEn}
                  fill
                  className="object-cover object-top"
                  style={{ filter: "brightness(0.65) saturate(1.1)" }}
                  sizes="(max-width: 768px) 100vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-[#0A0806]/15 to-transparent" />
              </div>
            )}

            {/* Incoming / current hero */}
            <div
              key={`curr-${safeIdx}-${filter}`}
              className={`absolute inset-0 ${
                prevHero ? (dir > 0 ? "hero-enter-right" : "hero-enter-left") : ""
              }`}
            >
              <Image
                src={current.image}
                alt={current.nameEn}
                fill
                className="object-cover object-top"
                style={{ filter: "brightness(0.75) saturate(1.2)" }}
                sizes="(max-width: 768px) 100vw, 90vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-[#0A0806]/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0806]/20 via-transparent to-[#0A0806]/20" />
            </div>

            {/* Hero info overlay */}
            <div
              key={`info-${safeIdx}-${filter}`}
              className="info-slide-up absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10"
            >
              {/* Faction badge */}
              <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full border border-[#C9A84C]/40 bg-[#0A0806]/70 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase">
                  {factionLabel(current.faction)}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  {/* Hero name */}
                  <h3
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5EDD5] leading-none mb-2 truncate"
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      textShadow: "0 0 60px rgba(201,168,76,0.5), 0 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {zh ? current.nameZh : current.nameEn}
                  </h3>

                  {/* Title with divider */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-6 bg-[#C9A84C]" />
                    <p className="text-[#E8C96A] text-base sm:text-lg font-medium tracking-wide">
                      {zh ? current.titleZh : current.titleEn}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[#B8A882]/85 text-sm leading-relaxed max-w-xl hidden sm:block">
                    {zh ? current.descZh : current.descEn}
                  </p>
                </div>

                {/* Navigation arrows */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { goTo(safeIdx - 1, -1); resetTimer(); }}
                    aria-label="Previous hero"
                    className="w-11 h-11 rounded-full border border-[#C9A84C]/40 bg-[#0A0806]/70 backdrop-blur-sm flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0806] hover:border-[#C9A84C] transition-all duration-250"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { goTo(safeIdx + 1, 1); resetTimer(); }}
                    aria-label="Next hero"
                    className="w-11 h-11 rounded-full border border-[#C9A84C]/40 bg-[#0A0806]/70 backdrop-blur-sm flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0806] hover:border-[#C9A84C] transition-all duration-250"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[#C9A84C]/50 text-xs font-mono tabular-nums">
                  {String(safeIdx + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                </span>
                <div className="flex-1 max-w-[160px] h-px bg-[#C9A84C]/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] transition-all duration-500 rounded-full"
                    style={{ width: `${((safeIdx + 1) / filtered.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 right-4 z-10 opacity-60">
              <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
            </div>
            <div className="absolute top-4 left-4 z-10">
              <div className="w-8 h-8 border-t border-l border-[#C9A84C]/40 rounded-tl-sm" />
            </div>
            <div className="absolute bottom-[140px] sm:bottom-[180px] right-4 z-10">
              <div className="w-8 h-8 border-b border-r border-[#C9A84C]/40 rounded-br-sm" />
            </div>
          </div>

          {/* Thumbnail strip */}
          <div
            ref={thumbsRef}
            className="thumb-scroll flex gap-2.5 overflow-x-auto py-1 px-1 justify-start lg:justify-center"
          >
            {filtered.map((hero, idx) => (
              <button
                key={`${filter}-${hero.nameZh}`}
                onClick={() => { goTo(idx, idx > safeIdx ? 1 : -1); resetTimer(); }}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  idx === safeIdx
                    ? "w-[72px] h-[72px] ring-2 ring-[#C9A84C] ring-offset-1 ring-offset-[#0A0806] scale-110 opacity-100 shadow-lg shadow-[#C9A84C]/30"
                    : "w-14 h-14 opacity-40 hover:opacity-70 hover:scale-105"
                }`}
              >
                <Image
                  src={hero.image}
                  alt={zh ? hero.nameZh : hero.nameEn}
                  fill
                  className="object-cover object-top"
                  sizes="72px"
                />
                {idx === safeIdx && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806]/50 to-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
