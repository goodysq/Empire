"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { loc } from "@/lib/loc";

interface NavbarProps {
  locale: string;
  logoUrl?: string;
  gameNameZh?: string;
  gameNameEn?: string;
  navItems?: { id: string; labelZh: string; labelEn: string; href: string }[];
  customNavSections?: { key: string; labelZh: string; labelEn: string }[];
}

// Fallback static links used only when DB has no nav items
const fallbackNavLinks = [
  { labelZh: "英雄", labelEn: "Heroes", href: "#heroes" },
  { labelZh: "文明", labelEn: "Civilizations", href: "#world" },
  { labelZh: "资讯", labelEn: "News", href: "#news" },
  { labelZh: "下载", labelEn: "Download", href: "#download" },
];

const LOCALES = [
  { code: "zh", label: "简体中文", short: "简" },
  { code: "zh-TW", label: "繁體中文", short: "繁" },
  { code: "en", label: "English", short: "EN" },
];

function getLabel(locale: string) {
  return LOCALES.find((l) => l.code === locale)?.short ?? "中";
}


function getDownloadLabel(locale: string) {
  if (locale === "en") return "Download";
  if (locale === "zh-TW") return "立即下載";
  return "立即下载";
}

export default function Navbar({ locale, logoUrl, gameNameZh, gameNameEn, navItems, customNavSections }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    setLangOpen(false);
    setMobileOpen(false);
    // Replace the locale prefix in the current path so we stay on the same page
    const withoutLocale = pathname.replace(/^\/(zh-TW|zh|en)/, "");
    router.push(`/${newLocale}${withoutLocale}`);
  };

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Build the final nav link list:
  // 1. DB-managed nav items (from admin → navigation)
  // 2. + custom sections with showInNav=true appended at end
  const activeNavLinks = navItems && navItems.length > 0 ? navItems : fallbackNavLinks;
  const allNavLinks = [
    ...activeNavLinks,
    ...(customNavSections ?? []).map((s) => ({
      id: s.key,
      labelZh: s.labelZh,
      labelEn: s.labelEn,
      href: `#${s.key}`,
    })),
  ];

  const getLabel2 = (link: { labelZh: string; labelEn: string }) =>
    locale === "en" ? link.labelEn : link.labelZh;

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (!href.startsWith("#")) {
      router.push(href);
      return;
    }
    if (isHome) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${locale}${href}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0806]/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C] to-[#8B5E1A] rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-white font-bold text-lg" style={{ fontFamily: "var(--font-cinzel)" }}>
                    帝
                  </span>
                </>
              )}
            </div>
            <div>
              <div className="text-[#E8C96A] font-bold text-lg leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>
                {locale === "en"
                  ? (gameNameEn || "Empire Chronicles")
                  : (gameNameZh || (locale === "zh-TW" ? "帝國紀元" : "帝国纪元"))}
              </div>
              <div className="text-[#B8A882] text-xs leading-none mt-0.5">
                {gameNameEn || "Empire Chronicles"}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {allNavLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-[#F5EDD5]/80 hover:text-[#E8C96A] transition-colors text-sm font-medium tracking-wide uppercase cursor-pointer"
              >
                {getLabel2(link)}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 text-[#B8A882] hover:text-[#E8C96A] transition-colors text-sm"
              >
                <Globe size={16} />
                <span>{getLabel(locale)}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-8 bg-[#1A1510] border border-[#C9A84C]/30 rounded-lg shadow-xl shadow-black/50 overflow-hidden min-w-[140px] z-50">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        locale === l.code
                          ? "bg-[#C9A84C]/20 text-[#E8C96A]"
                          : "text-[#B8A882] hover:bg-[#C9A84C]/10 hover:text-[#F5EDD5]"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => scrollTo("#download")}
              className="relative px-6 py-2 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] font-bold text-sm rounded overflow-hidden group transition-all hover:shadow-lg hover:shadow-[#C9A84C]/30"
            >
              <span className="relative z-10">{getDownloadLabel(locale)}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8C96A] to-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#F5EDD5] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0A0806]/98 backdrop-blur-md border-t border-[#C9A84C]/20 px-4 py-4 space-y-3">
          {allNavLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left text-[#F5EDD5]/80 hover:text-[#E8C96A] py-2 text-base font-medium transition-colors"
            >
              {getLabel2(link)}
            </button>
          ))}

          {/* Language options in mobile */}
          <div className="pt-2 border-t border-[#C9A84C]/20">
            <p className="text-[#B8A882]/50 text-xs mb-2 uppercase tracking-wider">{loc(locale, "语言 / Language", "語言 / Language", "Language")}</p>
            <div className="flex gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`flex-1 py-2 text-sm rounded transition-colors ${
                    locale === l.code
                      ? "bg-[#C9A84C]/20 text-[#E8C96A] border border-[#C9A84C]/40"
                      : "text-[#B8A882] hover:text-[#F5EDD5] border border-transparent"
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollTo("#download")}
            className="w-full py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] font-bold text-sm rounded"
          >
            {getDownloadLabel(locale)}
          </button>
        </div>
      </div>
    </nav>
  );
}
