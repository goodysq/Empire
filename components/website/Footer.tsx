"use client";

import Link from "next/link";
import { loc } from "@/lib/loc";

interface SocialLinks {
  weibo?: string;
  wechat?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
}

interface SupportLinks {
  privacy?: string;
  terms?: string;
  contact?: string;
  faq?: string;
}

interface FooterProps {
  locale: string;
  iosLink?: string;
  androidLink?: string;
  socialLinks?: SocialLinks;
  supportLinks?: SupportLinks;
  logoUrl?: string;
  gameNameZh?: string;
  gameNameEn?: string;
}

const socialIcons: {
  key: keyof SocialLinks;
  title: string;
  svg: React.ReactNode;
}[] = [
  {
    key: "weibo",
    title: "微博",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9.31 8.17c-3.41.37-6.02 2.87-5.81 5.58.2 2.7 3.13 4.61 6.54 4.24 3.41-.37 6.01-2.87 5.81-5.58-.21-2.7-3.13-4.61-6.54-4.24zm-.14 7.96c-1.72.19-3.21-.78-3.31-2.16-.1-1.37 1.22-2.65 2.94-2.84 1.72-.19 3.21.78 3.31 2.16.1 1.37-1.22 2.65-2.94 2.84zm.91-1.98c-.32.61-1.03.9-1.59.64-.55-.25-.71-.95-.39-1.57.32-.61 1.03-.9 1.59-.64.56.25.71.95.39 1.57zM14.07 3.5c-.38-.05-.64.24-.6.65.04.41.37.75.75.8 1.5.21 2.63 1.27 2.51 2.63-.07.72-.44 1.37-1.03 1.83-.32.25-.38.72-.14 1.06.24.33.67.4.99.14.88-.68 1.44-1.67 1.55-2.75.19-1.97-1.46-3.65-4.03-4.36zm.82-2.5c-.38-.06-.64.23-.6.64.04.41.37.75.75.81 2.73.38 4.79 2.35 4.57 4.7-.11 1.14-.67 2.14-1.54 2.86-.32.26-.38.73-.14 1.06.24.33.67.4.99.14 1.19-.97 1.97-2.34 2.12-3.88.3-3.1-2.14-5.72-6.15-6.33z" />
      </svg>
    ),
  },
  {
    key: "wechat",
    title: "微信",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.746 4.208 7.13 4.208.943 0 1.87-.199 2.721-.595a.498.498 0 0 1 .415.016l1.392.813a.19.19 0 0 0 .1.031c.151 0 .274-.123.274-.272a.297.297 0 0 0-.028-.121l-.3-1.088a.436.436 0 0 1 .155-.453 6.22 6.22 0 0 0 2.221-4.607c.028-3.965-3.762-6.938-7.02-6.938z" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    title: "抖音",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    title: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    key: "twitter",
    title: "Twitter / X",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "discord",
    title: "Discord",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    title: "Telegram",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function Footer({
  locale,
  iosLink = "",
  androidLink = "",
  socialLinks = {},
  logoUrl,
  gameNameZh,
  gameNameEn,
}: FooterProps) {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const activeSocials = socialIcons.filter((s) => !!socialLinks[s.key]);

  const supportItems = [
    { labelZh: "隐私政策", labelTw: "隱私政策", labelEn: "Privacy Policy", href: `/${locale}/support#privacy` },
    { labelZh: "用户协议", labelTw: "使用者協議", labelEn: "Terms of Service", href: `/${locale}/support#terms` },
    { labelZh: "联系我们", labelTw: "聯絡我們", labelEn: "Contact Us", href: `/${locale}/support#contact` },
    { labelZh: "常见问题", labelTw: "常見問題", labelEn: "FAQ", href: `/${locale}/support#faq` },
  ];

  return (
    <footer className="relative bg-[#050403] border-t border-[#C9A84C]/15 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] to-[#8B5E1A] rounded-lg opacity-80" />
                    <span className="relative text-white font-bold text-lg" style={{ fontFamily: "var(--font-cinzel)" }}>
                      帝
                    </span>
                  </>
                )}
              </div>
              <div>
                <div className="text-[#E8C96A] font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {gameNameZh || (locale === "zh-TW" ? "帝國紀元" : "帝国纪元")}
                </div>
                <div className="text-[#B8A882] text-xs">{gameNameEn || "Empire Chronicles"}</div>
              </div>
            </div>
            <p className="text-[#B8A882]/70 text-sm leading-relaxed mb-6">
              {loc(locale, "纵横千古，逐鹿天下。史诗级移动端策略游戏。", "縱橫千古，逐鹿天下。史詩級移動端策略遊戲。", "Command History. Conquer the World. Epic mobile strategy game.")}
            </p>

            {/* Social icons — only render if URL is configured */}
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map((s) => (
                  <a
                    key={s.key}
                    href={socialLinks[s.key] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#1A1510] border border-[#C9A84C]/20 flex items-center justify-center text-[#B8A882] hover:text-[#E8C96A] hover:border-[#C9A84C]/50 transition-all hover:scale-110"
                    title={s.title}
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#E8C96A] font-semibold mb-4 text-sm uppercase tracking-wider">
              {loc(locale, "快速链接", "快速連結", "Quick Links")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { labelZh: "英雄图鉴", labelTw: "英雄圖鑑", labelEn: "Heroes", href: "#heroes" },
                { labelZh: "文明", labelTw: "文明", labelEn: "Civilizations", href: "#world" },
                { labelZh: "最新资讯", labelTw: "最新資訊", labelEn: "News", href: "#news" },
                { labelZh: "立即下载", labelTw: "立即下載", labelEn: "Download", href: "#download" },
              ].map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-[#B8A882]/70 hover:text-[#E8C96A] text-sm transition-all duration-200 hover:translate-x-1 inline-block"
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
              {supportItems.map((item) => (
                <li key={item.labelEn}>
                  <a
                    href={item.href}
                    className="text-[#B8A882]/70 hover:text-[#E8C96A] text-sm transition-colors duration-200"
                  >
                    {loc(locale, item.labelZh, item.labelTw, item.labelEn)}
                  </a>
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
                href={iosLink || "#download"}
                target={iosLink ? "_blank" : undefined}
                rel={iosLink ? "noopener noreferrer" : undefined}
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
                href={androidLink || "#download"}
                target={androidLink ? "_blank" : undefined}
                rel={androidLink ? "noopener noreferrer" : undefined}
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

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#B8A882]/40 text-xs text-center sm:text-left">
            {loc(locale, "© 2024 帝国纪元. 保留所有权利.", "© 2024 帝國紀元. 保留所有權利.", "© 2024 Empire Chronicles. All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
