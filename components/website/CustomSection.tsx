"use client";

import { toTraditional } from "@/lib/opencc";

interface CustomSectionProps {
  locale: string;
  titleZh?: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  contentZh?: string;
  contentEn?: string;
  imageUrl?: string;
}

export default function CustomSection({
  locale,
  titleZh,
  titleEn,
  subtitleZh,
  subtitleEn,
  contentZh,
  contentEn,
  imageUrl,
}: CustomSectionProps) {
  const isEn = locale === "en";
  const isZhTW = locale === "zh-TW";

  const rawTitle = isEn ? (titleEn || titleZh || "") : (titleZh || titleEn || "");
  const rawSubtitle = isEn ? (subtitleEn || subtitleZh || "") : (subtitleZh || subtitleEn || "");
  const rawContent = isEn ? (contentEn || contentZh || "") : (contentZh || contentEn || "");

  const title = isZhTW ? toTraditional(rawTitle, locale) : rawTitle;
  const subtitle = isZhTW ? toTraditional(rawSubtitle, locale) : rawSubtitle;
  const content = isZhTW ? toTraditional(rawContent, locale) : rawContent;

  const hasContent = title || subtitle || content || imageUrl;
  if (!hasContent) return null;

  return (
    <section className="py-20 px-4 bg-[#0A0806] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/3 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
            )}
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-6" />
          </div>
        )}

        {/* Image */}
        {imageUrl && (
          <div className="mb-10 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title || ""}
              className="w-full object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Rich text content */}
        {content && (
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-[#E8C96A] prose-headings:font-bold
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-[#C9A84C] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-li:marker:text-[#C9A84C]
              prose-blockquote:border-[#C9A84C] prose-blockquote:text-gray-400
              prose-code:text-[#E8C96A] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
