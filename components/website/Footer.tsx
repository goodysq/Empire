"use client";

import Link from "next/link";
import { loc } from "@/lib/loc";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const zh = locale !== "en";

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050403] border-t border-[#C9A84C]/15 overflow-hidden">
      {/* Top golden accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] to-[#8B5E1A] rounded-lg opacity-80" />
                <span className="relative text-white font-bold text-lg" style={{ fontFamily: "var(--font-cinzel)" }}>
                  帝
                </span>
              </div>
              <div>
                <div className="text-[#E8C96A] font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {locale === "zh-TW" ? "帝國紀元" : "帝国纪元"}
                </div>
                <div className="text-[#B8A882] text-xs">Empire Chronicles</div>
              </div>
            </div>
            <p className="text-[#B8A882]/70 text-sm leading-relaxed mb-6">
              {loc(locale, "纵横千古，逐鹿天下。史诗级移动端策略游戏。", "縱橫千古，逐鹿天下。史詩級移動端策略遊戲。", "Command History. Conquer the World. Epic mobile strategy game.")}
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {/* Weibo */}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#1A1510] border border-[#C9A84C]/20 flex items-center justify-center text-[#B8A882] hover:text-[#E8C96A] hover:border-[#C9A84C]/50 transition-all hover:scale-110"
                title="微博"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M9.31 8.17c-3.41.37-6.02 2.87-5.81 5.58.2 2.7 3.13 4.61 6.54 4.24 3.41-.37 6.01-2.87 5.81-5.58-.21-2.7-3.13-4.61-6.54-4.24zm-.14 7.96c-1.72.19-3.21-.78-3.31-2.16-.1-1.37 1.22-2.65 2.94-2.84 1.72-.19 3.21.78 3.31 2.16.1 1.37-1.22 2.65-2.94 2.84zm.91-1.98c-.32.61-1.03.9-1.59.64-.55-.25-.71-.95-.39-1.57.32-.61 1.03-.9 1.59-.64.56.25.71.95.39 1.57zM14.07 3.5c-.38-.05-.64.24-.6.65.04.41.37.75.75.8 1.5.21 2.63 1.27 2.51 2.63-.07.72-.44 1.37-1.03 1.83-.32.25-.38.72-.14 1.06.24.33.67.4.99.14.88-.68 1.44-1.67 1.55-2.75.19-1.97-1.46-3.65-4.03-4.36zm.82-2.5c-.38-.06-.64.23-.6.64.04.41.37.75.75.81 2.73.38 4.79 2.35 4.57 4.7-.11 1.14-.67 2.14-1.54 2.86-.32.26-.38.73-.14 1.06.24.33.67.4.99.14 1.19-.97 1.97-2.34 2.12-3.88.3-3.1-2.14-5.72-6.15-6.33z" />
                </svg>
              </a>
              {/* WeChat */}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#1A1510] border border-[#C9A84C]/20 flex items-center justify-center text-[#B8A882] hover:text-[#E8C96A] hover:border-[#C9A84C]/50 transition-all hover:scale-110"
                title="微信"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.746 4.208 7.支持 4.208.943 0 1.87-.199 2.721-.595a.498.498 0 0 1 .415.016l1.392.813a.19.19 0 0 0 .1.031c.151 0 .274-.123.274-.272a.297.297 0 0 0-.028-.121l-.3-1.088a.436.436 0 0 1 .155-.453 6.22 6.22 0 0 0 2.221-4.607c.028-3.965-3.762-6.938-7.89-7.938z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#1A1510] border border-[#C9A84C]/20 flex items-center justify-center text-[#B8A882] hover:text-[#E8C96A] hover:border-[#C9A84C]/50 transition-all hover:scale-110"
                title="抖音"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-[#1A1510] border border-[#C9A84C]/20 flex items-center justify-center text-[#B8A882] hover:text-[#E8C96A] hover:border-[#C9A84C]/50 transition-all hover:scale-110"
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#E8C96A] font-semibold mb-4 text-sm uppercase tracking-wider">
              {loc(locale, "快速链接", "快速連結", "Quick Links")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { labelZh: "英雄图鉴", labelTw: "英雄圖鑑", labelEn: "Heroes", href: "#heroes" },
                { labelZh: "世界观", labelTw: "世界觀", labelEn: "World", href: "#world" },
                { labelZh: "最新资讯", labelTw: "最新資訊", labelEn: "News", href: "#news" },
                { labelZh: "立即下载", labelTw: "立即下載", labelEn: "Download", href: "#download" },
              ].map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-[#B8A882]/70 hover:text-[#E8C96A] text-sm transition-colors duration-200 hover:translate-x-1 inline-block transition-all"
                  >
                    {loc(locale, item.labelZh, item.labelTw, item.labelEn)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#E8C96A] font-semibold mb-4 text-sm uppercase tracking-wider">
              {loc(locale, "支持", "支援", "Support")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { labelZh: "隐私政策", labelTw: "隱私政策", labelEn: "Privacy Policy", href: "#" },
                { labelZh: "用户协议", labelTw: "使用者協議", labelEn: "Terms of Service", href: "#" },
                { labelZh: "联系我们", labelTw: "聯絡我們", labelEn: "Contact Us", href: "#" },
                { labelZh: "常见问题", labelTw: "常見問題", labelEn: "FAQ", href: "#" },
              ].map((item) => (
                <li key={item.labelEn}>
                  <Link
                    href={item.href}
                    className="text-[#B8A882]/70 hover:text-[#E8C96A] text-sm transition-colors duration-200"
                  >
                    {loc(locale, item.labelZh, item.labelTw, item.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download CTA */}
          <div>
            <h4 className="text-[#E8C96A] font-semibold mb-4 text-sm uppercase tracking-wider">
              {loc(locale, "立即体验", "立即體驗", "Play Now")}
            </h4>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 bg-[#1A1510] border border-[#C9A84C]/30 rounded-lg hover:border-[#C9A84C]/60 hover:bg-[#1A1510]/80 transition-all group"
              >
                <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-[#B8A882] text-xs">{loc(locale, "下载于", "下載於", "Download on")}</div>
                  <div className="text-[#F5EDD5] text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 bg-[#1A1510] border border-[#C9A84C]/30 rounded-lg hover:border-[#C9A84C]/60 transition-all group"
              >
                <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
                </svg>
                <div>
                  <div className="text-[#B8A882] text-xs">{loc(locale, "下载于", "下載於", "Get it on")}</div>
                  <div className="text-[#F5EDD5] text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#B8A882]/40 text-xs text-center sm:text-left">
            {loc(locale, "© 2024 帝国纪元. 保留所有权利.", "© 2024 帝國紀元. 保留所有權利.", "© 2024 Empire Chronicles. All rights reserved.")}
          </p>
          <p className="text-[#B8A882]/40 text-xs">
            {loc(locale, "ICP备XXXXXXXX号", "ICP備XXXXXXXX號", "ICP No. XXXXXXXX")}
          </p>
        </div>
      </div>
    </footer>
  );
}
