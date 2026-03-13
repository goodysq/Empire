import { prisma } from "@/lib/db";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { toTraditional } from "@/lib/opencc";
import { sanitize } from "@/lib/sanitize";
import { loc as locFn } from "@/lib/loc";
import Link from "next/link";
import type { SiteSetting, PageSection } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

const sections = [
  { key: "support_privacy", anchor: "privacy", labelZh: "隐私政策", labelTw: "隱私政策", labelEn: "Privacy Policy" },
  { key: "support_terms",   anchor: "terms",   labelZh: "用户协议", labelTw: "使用者協議", labelEn: "Terms of Service" },
  { key: "support_contact", anchor: "contact", labelZh: "联系我们", labelTw: "聯絡我們", labelEn: "Contact Us" },
  { key: "support_faq",     anchor: "faq",     labelZh: "常见问题", labelTw: "常見問題", labelEn: "FAQ" },
];

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [pageSections, allSettings] = await Promise.all([
    prisma.pageSection.findMany({
      where: { key: { in: sections.map((s) => s.key) } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const gs = (key: string) => allSettings.find((s: SiteSetting) => s.key === key)?.value ?? "";

  const iosLink = gs("ios_link");
  const androidLink = gs("android_link");
  const logoUrl = gs("logo_url");
  const gameNameZh = gs("game_name_zh");
  const gameNameEn = gs("game_name_en");

  const socialLinks = {
    weibo: gs("weibo_url") || undefined,
    wechat: gs("wechat_id") || undefined,
    tiktok: gs("tiktok_url") || undefined,
    youtube: gs("youtube_url") || undefined,
    twitter: gs("twitter_url") || undefined,
    discord: gs("discord_url") || undefined,
    telegram: gs("telegram_url") || undefined,
  };

  // Build content map
  const contentMap = Object.fromEntries(
    pageSections.map((s: PageSection) => [s.key, s])
  );

  function getTitle(key: string, section: (typeof sections)[0]) {
    const ps = contentMap[key];
    const zhTitle = ps?.titleZh || locFn(locale, section.labelZh, section.labelTw, section.labelEn);
    if (locale === "zh-TW") return toTraditional(zhTitle, locale);
    if (locale === "en") return ps?.titleEn || section.labelEn;
    return zhTitle;
  }

  function getContent(key: string) {
    const ps = contentMap[key];
    if (!ps) return "";
    if (locale === "en" && ps.contentEn) return ps.contentEn;
    const zh = ps.contentZh || "";
    if (locale === "zh-TW") return toTraditional(zh, locale);
    return zh;
  }

  return (
    <main className="bg-[#0A0806] min-h-screen">
      <Navbar locale={locale} logoUrl={logoUrl} gameNameZh={gameNameZh} gameNameEn={gameNameEn} />

      {/* Hero banner */}
      <div className="pt-24 pb-10 px-4 text-center border-b border-[#C9A84C]/10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>
        <h1 className="text-3xl font-bold text-[#E8C96A]">
          {locFn(locale, "支持中心", "支援中心", "Support Center")}
        </h1>
        <p className="text-[#B8A882]/60 text-sm mt-2">
          {locFn(locale, "隐私政策 · 用户协议 · 联系我们 · 常见问题", "隱私政策 · 使用者協議 · 聯絡我們 · 常見問題", "Privacy · Terms · Contact · FAQ")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-10">
        {/* Sticky sidebar nav */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <nav className="sticky top-28 space-y-1">
            {sections.map((s) => (
              <a
                key={s.anchor}
                href={`#${s.anchor}`}
                className="block px-4 py-2.5 text-sm text-[#B8A882]/70 hover:text-[#E8C96A] hover:bg-[#C9A84C]/5 rounded-lg transition-all border border-transparent hover:border-[#C9A84C]/20"
              >
                {locFn(locale, s.labelZh, s.labelTw, s.labelEn)}
              </a>
            ))}
            <div className="pt-4 border-t border-[#C9A84C]/10">
              <Link
                href={`/${locale}`}
                className="block px-4 py-2 text-xs text-[#B8A882]/40 hover:text-[#B8A882] transition-colors"
              >
                ← {locFn(locale, "返回首页", "返回首頁", "Back to Home")}
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-16">
          {sections.map((s) => {
            const title = getTitle(s.key, s);
            const content = getContent(s.key);
            return (
              <section key={s.anchor} id={s.anchor} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#C9A84C] to-[#8B5E1A] rounded-full" />
                  <h2 className="text-xl font-bold text-[#E8C96A]">{title}</h2>
                </div>
                {content ? (
                  <div
                    className="prose prose-invert prose-sm max-w-none text-[#B8A882]/80 leading-relaxed
                      prose-headings:text-[#E8C96A] prose-headings:font-semibold
                      prose-a:text-[#C9A84C] prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-[#F5EDD5] prose-li:text-[#B8A882]/80
                      prose-hr:border-[#C9A84C]/20"
                    dangerouslySetInnerHTML={{ __html: sanitize(content) }}
                  />
                ) : (
                  <div className="text-[#B8A882]/30 text-sm italic border border-dashed border-[#C9A84C]/10 rounded-xl p-8 text-center">
                    {locFn(locale, "内容待完善，请在后台版块管理中编辑。", "內容待完善，請在後台版塊管理中編輯。", "Content coming soon. Edit in admin → Sections.")}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <Footer
        locale={locale}
        iosLink={iosLink}
        androidLink={androidLink}
        socialLinks={socialLinks}
        logoUrl={logoUrl}
        gameNameZh={gameNameZh}
        gameNameEn={gameNameEn}
      />
    </main>
  );
}
