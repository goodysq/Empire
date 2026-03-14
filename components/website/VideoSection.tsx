"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { loc } from "@/lib/loc";

interface VideoSectionProps {
  locale: string;
  videoUrl?: string;
  titleZh?: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
}

export default function VideoSection({
  locale,
  videoUrl,
  titleZh = "精彩视频",
  titleEn = "Featured Video",
  subtitleZh = "观看游戏宣传片",
  subtitleEn = "Watch the game trailer",
}: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(videoUrl);

  return (
    <section id="video" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#0D0B07] to-[#0A0806]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[#C9A84C] text-sm font-medium tracking-[0.3em] uppercase">
              {loc(locale, subtitleZh, subtitleZh, subtitleEn)}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#F5EDD5]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {loc(locale, titleZh, titleZh, titleEn)}
          </h2>
        </div>

        {/* Video container */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#C9A84C]/30 bg-[#0A0806]">
          {playing && videoUrl ? (
            <iframe
              src={videoUrl}
              title="Game Trailer"
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          ) : (
            <button
              onClick={() => { if (hasVideo) setPlaying(true); }}
              className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 transition-colors ${
                hasVideo ? "cursor-pointer hover:bg-[#C9A84C]/5" : "cursor-default"
              }`}
            >
              {/* Play button */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors ${
                    hasVideo
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-[#C9A84C]/30 bg-transparent"
                  }`}
                >
                  <Play
                    size={32}
                    className={`ml-1 ${hasVideo ? "text-[#C9A84C]" : "text-[#C9A84C]/30"}`}
                    fill="currentColor"
                  />
                </div>
                {hasVideo && (
                  <div className="absolute inset-0 rounded-full border border-[#C9A84C]/40 animate-ping" />
                )}
              </div>

              <span
                className={`text-sm font-medium tracking-[0.3em] uppercase ${
                  hasVideo ? "text-[#C9A84C]" : "text-[#C9A84C]/30"
                }`}
              >
                {loc(locale, "观看视频", "觀看視頻", "WATCH TRAILER")}
              </span>

              {!hasVideo && (
                <span className="text-[#B8A882]/40 text-xs">
                  {loc(locale, "即将上线", "即將上線", "Coming Soon")}
                </span>
              )}
            </button>
          )}

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C9A84C]/50 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C9A84C]/50 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C9A84C]/50 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C9A84C]/50 rounded-br-xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
