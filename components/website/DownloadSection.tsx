"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface DownloadSectionProps {
  locale: string;
  iosLink?: string;
  androidLink?: string;
}

const t = {
  zh: {
    title: "立即开始征途",
    subtitle: "开启史诗征程",
    desc: "加入全球数百万玩家，在帝国纪元中建立你的传奇帝国。立即下载，开启史诗征程！",
    downloadOn: "下载于",
    getItOn: "下载于",
    scanQR: "扫码下载",
  },
  "zh-TW": {
    title: "立即開始征途",
    subtitle: "開啟史詩征程",
    desc: "加入全球數百萬玩家，在帝國紀元中建立你的傳奇帝國。立即下載，開啟史詩征程！",
    downloadOn: "下載於",
    getItOn: "下載於",
    scanQR: "掃碼下載",
  },
  en: {
    title: "Begin Your Journey",
    subtitle: "Start Your Epic Journey",
    desc: "Join millions of players worldwide and build your legendary empire in Empire Chronicles. Download now!",
    downloadOn: "Download on the",
    getItOn: "Get it on",
    scanQR: "Scan for",
  },
};

function QRCode({ url, size = 120 }: { url: string; size?: number }) {
  const [hasUrl, setHasUrl] = useState(false);

  useEffect(() => {
    setHasUrl(!!url && url.startsWith("http"));
  }, [url]);

  if (hasUrl) {
    return (
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=C9A84C&bgcolor=1A1510`}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-md"
      />
    );
  }

  // Placeholder QR pattern
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-2 grid grid-cols-7 grid-rows-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              backgroundColor:
                (i < 21 && i % 7 < 3) ||
                (i >= 28 && i < 49 && i % 7 >= 4) ||
                (i >= 7 && i < 14 && i % 7 >= 4) ||
                (i * 7 + i % 3) % 2 === 0
                  ? "#C9A84C"
                  : "transparent",
            }}
          />
        ))}
      </div>
      {/* Corner squares for QR look */}
      <div className="absolute top-2 left-2 w-6 h-6 border-2 border-[#C9A84C] rounded-sm" />
      <div className="absolute top-2 right-2 w-6 h-6 border-2 border-[#C9A84C] rounded-sm" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-2 border-[#C9A84C] rounded-sm" />
    </div>
  );
}

export default function DownloadSection({ locale, iosLink = "", androidLink = "" }: DownloadSectionProps) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const zh = locale !== "en";
  const copy = locale === "zh-TW" ? t["zh-TW"] : zh ? t.zh : t.en;

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

  return (
    <section
      ref={sectionRef}
      id="download"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0806]" />

      <div className="absolute right-0 bottom-0 w-[40%] h-full opacity-20 pointer-events-none">
        <Image
          src="/art/characters/亚历山大.png"
          alt=""
          fill
          className="object-cover object-top"
          style={{ objectPosition: "80% top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0806]" />
      </div>
      <div className="absolute left-0 bottom-0 w-[30%] h-full opacity-15 pointer-events-none">
        <Image
          src="/art/characters/托米里斯.png"
          alt=""
          fill
          className="object-cover object-top"
          style={{ objectPosition: "20% top" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0806]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#C9A84C]/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#C9A84C]/8 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Header */}
        <div
          className={`transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <span className="bg-gradient-to-b from-[#F5EDD5] via-[#E8C96A] to-[#C9A84C] bg-clip-text text-transparent">
              {copy.title}
            </span>
          </h2>
          <p className="text-[#B8A882] text-lg mb-2">{copy.subtitle}</p>
          <p className="text-[#B8A882]/70 text-base max-w-2xl mx-auto mb-10">
            {copy.desc}
          </p>
        </div>

        {/* Download buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href={iosLink || "#"}
            className="group relative flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] font-bold rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#C9A84C]/40 hover:scale-105 min-w-[220px]"
          >
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs leading-none mb-1 opacity-70">{copy.downloadOn}</div>
              <div className="text-xl leading-none font-black">App Store</div>
            </div>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          </a>

          <a
            href={androidLink || "#"}
            className="group relative flex items-center gap-4 px-8 py-4 border-2 border-[#C9A84C] text-[#E8C96A] font-bold rounded-lg overflow-hidden transition-all hover:bg-[#C9A84C]/10 hover:shadow-2xl hover:shadow-[#C9A84C]/20 hover:scale-105 min-w-[220px]"
          >
            <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.24.99.2l12.69-12.7-2.89-2.89L3.18 23.76zM20.51 10.3l-2.63-1.53-3.2 3.2 3.2 3.2 2.64-1.54c.75-.44.75-1.9-.01-2.33zM3.17.23C2.86.41 2.67.74 2.67 1.2v21.6c0 .44.19.8.5.97l12.79-12.79L3.17.23zM14.97 12L3.18.23l-.01-.01L14.97 12z" />
            </svg>
            <div className="text-left">
              <div className="text-xs leading-none mb-1 opacity-70">{copy.getItOn}</div>
              <div className="text-xl leading-none font-black">Google Play</div>
            </div>
          </a>
        </div>

        {/* QR codes — auto-generated from links */}
        <div
          className={`flex justify-center gap-8 transition-all duration-700 delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {([
            { platform: "iOS", url: iosLink },
            { platform: "Android", url: androidLink },
          ] as const).map(({ platform, url }) => (
            <div key={platform} className="flex flex-col items-center gap-3">
              <div className="relative w-[100px] h-[100px] rounded-lg border border-[#C9A84C]/40 bg-[#1A1510] overflow-hidden flex items-center justify-center">
                <QRCode url={url} size={96} />
              </div>
              <span className="text-[#B8A882] text-xs">
                {zh ? `${copy.scanQR} ${platform}` : `${copy.scanQR} ${platform}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
