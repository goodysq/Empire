import { toTraditional } from "@/lib/opencc";

interface CustomSectionBlockProps {
  sectionKey: string;
  titleZh?: string | null;
  titleEn?: string | null;
  subtitleZh?: string | null;
  subtitleEn?: string | null;
  contentZh?: string | null;
  contentEn?: string | null;
  imageUrl?: string | null;
  locale: string;
}

export default function CustomSectionBlock({
  sectionKey,
  titleZh,
  titleEn,
  subtitleZh,
  subtitleEn,
  contentZh,
  contentEn,
  imageUrl,
  locale,
}: CustomSectionBlockProps) {
  const isEn = locale === "en";
  const isTW = locale === "zh-TW";

  const title = isEn
    ? (titleEn || titleZh || "")
    : isTW
    ? toTraditional(titleZh || "", locale)
    : (titleZh || "");

  const subtitle = isEn
    ? (subtitleEn || subtitleZh || "")
    : isTW
    ? toTraditional(subtitleZh || "", locale)
    : (subtitleZh || "");

  const content = isEn
    ? (contentEn || contentZh || "")
    : isTW
    ? toTraditional(contentZh || "", locale)
    : (contentZh || "");

  return (
    <section id={sectionKey} className="relative py-20 lg:py-28 bg-[#0A0806]">
      {/* Subtle divider line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-[#E8C96A] mb-3"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[#B8A882] text-base lg:text-lg max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Body: image + content */}
        {(imageUrl || content) && (
          <div className={`flex flex-col ${imageUrl && content ? "lg:flex-row gap-10 items-start" : ""}`}>
            {imageUrl && (
              <div className={content ? "lg:w-1/2" : "w-full"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={title || sectionKey}
                  className="w-full rounded-xl object-cover shadow-2xl border border-[#C9A84C]/10"
                />
              </div>
            )}
            {content && (
              <div className={imageUrl ? "lg:w-1/2" : "max-w-3xl mx-auto w-full"}>
                <div
                  className="prose prose-invert prose-gold max-w-none text-[#D4C9A8] leading-relaxed"
                  style={{
                    "--tw-prose-body": "#D4C9A8",
                    "--tw-prose-headings": "#E8C96A",
                    "--tw-prose-links": "#C9A84C",
                  } as React.CSSProperties}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty placeholder */}
        {!imageUrl && !content && (
          <div className="text-center py-10 text-[#B8A882]/40 text-sm border border-dashed border-[#C9A84C]/20 rounded-xl">
            此板块暂无内容，请在后台编辑
          </div>
        )}
      </div>
    </section>
  );
}
