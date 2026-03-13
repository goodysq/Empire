"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { loc } from "@/lib/loc";

interface HeroSectionProps {
  locale: string;
  iosLink?: string;
  androidLink?: string;
  gameNameZh?: string;
  gameNameEn?: string;
}

const heroImages = [
  { src: "/art/characters/亚历山大.png", name: "Alexander" },
  { src: "/art/characters/秦始皇-临时.png", name: "Qin Shi Huang" },
  { src: "/art/characters/布迪卡-带英雄.png", name: "Boudica" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function HeroSection({ locale, iosLink = "", androidLink = "", gameNameZh = "烬火王冠", gameNameEn = "Cinder & Crown" }: HeroSectionProps) {
  const [currentHero, setCurrentHero] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  // Hero image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentHero((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addParticle = () => {
      if (particlesRef.current.length < 80) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 0.5),
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          life: 0,
          maxLife: Math.random() * 200 + 100,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.3) addParticle();
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.05;
        const fadeOut = 1 - p.life / p.maxLife;
        const alpha = p.opacity * fadeOut;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(232, 201, 106, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(201, 168, 76, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(201, 168, 76, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return p.life < p.maxLife;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const scrollDown = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  const zh = locale !== "en";

  return (
    <section className="relative w-full h-screen overflow-hidden" id="home">
      {/* Background hero images */}
      {heroImages.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentHero && !isTransitioning ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.name}
            fill
            className="object-cover object-center scale-105"
            style={{
              objectPosition: "55% 20%",
              filter: "brightness(0.45) saturate(1.3)",
            }}
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Layered overlays for centered layout */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806]/50 via-transparent to-[#0A0806]/85" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(10,8,6,0.65) 0%, rgba(10,8,6,0) 100%)",
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Centered content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 text-center">
        <div className="max-w-4xl w-full">
          {/* Eyebrow label */}
          <div className="mb-3">
            <span className="inline-block text-[#C9A84C] text-sm font-medium tracking-[0.35em] uppercase">
              {loc(locale, "史诗策略手游", "史詩策略手遊", "Epic Strategy Mobile Game")}
            </span>
          </div>

          {/* Game title */}
          <h1
            className="font-black leading-none mb-5"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {locale === "en" ? (
              // English: show full name, split into two lines at '&' or midpoint
              (() => {
                const parts = gameNameEn.split(/\s*&\s*/);
                if (parts.length >= 2) {
                  return (
                    <>
                      <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-b from-[#F5EDD5] via-[#E8C96A] to-[#C9A84C] bg-clip-text text-transparent drop-shadow-2xl">
                        {parts[0].trim().toUpperCase()}
                      </span>
                      <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-b from-[#E8C96A] via-[#C9A84C] to-[#8B5E1A] bg-clip-text text-transparent drop-shadow-2xl">
                        &amp; {parts[1].trim().toUpperCase()}
                      </span>
                    </>
                  );
                }
                return (
                  <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-b from-[#F5EDD5] via-[#E8C96A] to-[#C9A84C] bg-clip-text text-transparent drop-shadow-2xl">
                    {gameNameEn.toUpperCase()}
                  </span>
                );
              })()
            ) : (
              // Chinese: split at midpoint
              (() => {
                const name = gameNameZh;
                const mid = Math.ceil(name.length / 2);
                const line1 = name.slice(0, mid);
                const line2 = name.slice(mid);
                return (
                  <>
                    <span className="block text-6xl sm:text-7xl lg:text-8xl bg-gradient-to-b from-[#F5EDD5] via-[#E8C96A] to-[#C9A84C] bg-clip-text text-transparent drop-shadow-2xl">
                      {line1}
                    </span>
                    {line2 && (
                      <span className="block text-6xl sm:text-7xl lg:text-8xl bg-gradient-to-b from-[#E8C96A] via-[#C9A84C] to-[#8B5E1A] bg-clip-text text-transparent drop-shadow-2xl">
                        {line2}
                      </span>
                    )}
                  </>
                );
              })()
            )}
          </h1>

          {/* Symmetric golden divider — adapts to text width */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
            <div className="w-1.5 h-1.5 border border-[#C9A84C]/60 rotate-45" />
            <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>

          <p className="text-[#F5EDD5]/75 text-base sm:text-lg mb-2 font-light leading-relaxed">
            {loc(locale, "纵横千古，逐鹿天下", "縱橫千古，逐鹿天下", "Command History. Conquer the World.")}
          </p>
          <p className="text-[#B8A882] text-sm sm:text-base mb-10 leading-relaxed max-w-md mx-auto">
            {loc(locale,
              "集结历史上最伟大的英雄，建立不朽的帝国。联合盟友，征服世界，书写属于你的史诗传奇。",
              "集結歷史上最偉大的英雄，建立不朽的帝國。聯合盟友，征服世界，書寫屬於你的史詩傳奇。",
              "Rally history's greatest heroes, build an immortal empire. Unite your allies and conquer the world."
            )}
          </p>

          {/* CTA Buttons — centered */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={iosLink || "#download"}
              target={iosLink ? "_blank" : undefined}
              rel={iosLink ? "noopener noreferrer" : undefined}
              onClick={!iosLink ? (e) => { e.preventDefault(); document.querySelector("#download")?.scrollIntoView({ behavior: "smooth" }); } : undefined}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] font-bold rounded overflow-hidden transition-all hover:shadow-xl hover:shadow-[#C9A84C]/40 hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <div className="text-xs leading-none opacity-70">
                  {loc(locale, "下载于", "下載於", "Download on the")}
                </div>
                <div className="text-base leading-tight">App Store</div>
              </div>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </a>

            <a
              href={androidLink || "#download"}
              target={androidLink ? "_blank" : undefined}
              rel={androidLink ? "noopener noreferrer" : undefined}
              onClick={!androidLink ? (e) => { e.preventDefault(); document.querySelector("#download")?.scrollIntoView({ behavior: "smooth" }); } : undefined}
              className="group relative flex items-center gap-3 px-8 py-4 border border-[#C9A84C]/60 text-[#E8C96A] font-bold rounded overflow-hidden transition-all hover:bg-[#C9A84C]/10 hover:border-[#E8C96A] hover:shadow-lg hover:shadow-[#C9A84C]/20 hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
              </svg>
              <div>
                <div className="text-xs leading-none opacity-70">
                  {loc(locale, "下载于", "下載於", "Get it on")}
                </div>
                <div className="text-base leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Hero indicator dots */}
      <div className="absolute bottom-24 right-8 z-20 flex flex-col gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentHero(idx);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              idx === currentHero ? "h-8 bg-[#E8C96A]" : "h-3 bg-[#C9A84C]/40 hover:bg-[#C9A84C]/70"
            }`}
          />
        ))}
      </div>

      {/* Scroll down */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[#C9A84C]/70 hover:text-[#E8C96A] transition-colors group"
      >
        <span className="text-xs tracking-widest uppercase">
          {loc(locale, "探索", "探索", "Explore")}
        </span>
        <ChevronDown size={24} className="animate-bounce group-hover:animate-none" />
      </button>
    </section>
  );
}
