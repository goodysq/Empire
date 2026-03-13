"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Tag, Image as ImageIcon, BookOpen } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/admin/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] bg-[#0F1117] border border-gray-600 rounded-lg animate-pulse" />
  ),
});

const CATEGORY_PRESETS = ["新手入门", "英雄攻略", "战斗技巧", "联盟策略", "资源管理", "活动攻略"];

interface GuideForm {
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  coverImage: string;
  category: string;
  isVisible: boolean;
}

const defaultForm: GuideForm = {
  titleZh: "",
  titleEn: "",
  excerptZh: "",
  excerptEn: "",
  contentZh: "",
  contentEn: "",
  coverImage: "",
  category: "",
  isVisible: true,
};

export default function GuideEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const [form, setForm] = useState<GuideForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"zh" | "en">("zh");
  const [useCustomCat, setUseCustomCat] = useState(false);
  const [customCat, setCustomCat] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/guides/${id}`)
        .then((r) => r.json())
        .then((data) => {
          const cat = data.category || "";
          const isCustom = cat && !CATEGORY_PRESETS.includes(cat);
          setForm({
            titleZh: data.titleZh || "",
            titleEn: data.titleEn || "",
            excerptZh: data.excerptZh || "",
            excerptEn: data.excerptEn || "",
            contentZh: data.contentZh || "",
            contentEn: data.contentEn || "",
            coverImage: data.coverImage || "",
            category: isCustom ? "" : cat,
            isVisible: data.isVisible ?? true,
          });
          if (isCustom) { setUseCustomCat(true); setCustomCat(cat); }
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    const finalCategory = useCustomCat ? customCat : form.category;
    const payload = { ...form, category: finalCategory };
    try {
      const url = isNew ? "/api/guides" : `/api/guides/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (isNew && data.id) {
        router.push(`/admin/guides/${data.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">加载中...</div>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/guides"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-[#C9A84C]" />
            {isNew ? "新建攻略" : "编辑攻略"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form.titleZh.trim()}
          className="flex items-center gap-2 px-5 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {/* Language tabs */}
      <div className="flex border-b border-gray-700">
        {(["zh", "en"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-6 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === lang
                ? "text-[#E8C96A] border-[#C9A84C]"
                : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            {lang === "zh" ? "中文" : "English"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {activeTab === "zh" ? "标题（中文）" : "Title (English)"}
            {activeTab === "zh" && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            value={activeTab === "zh" ? form.titleZh : form.titleEn}
            onChange={(e) => setForm({ ...form, [activeTab === "zh" ? "titleZh" : "titleEn"]: e.target.value })}
            placeholder={activeTab === "zh" ? "攻略标题..." : "Guide title..."}
            className="w-full px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {activeTab === "zh" ? "简介摘要（中文）" : "Excerpt (English)"}
          </label>
          <textarea
            rows={2}
            value={activeTab === "zh" ? form.excerptZh : form.excerptEn}
            onChange={(e) => setForm({ ...form, [activeTab === "zh" ? "excerptZh" : "excerptEn"]: e.target.value })}
            placeholder={activeTab === "zh" ? "简短描述..." : "Brief description..."}
            className="w-full px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
          />
        </div>

        {/* Cover + Category (only show on zh tab for convenience) */}
        {activeTab === "zh" && (
          <>
            {/* Cover image */}
            <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#C9A84C]" /> 封面图片 URL
              </label>
              <div className="flex gap-3">
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://... 或媒体库复制的链接"
                  className="flex-1 px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
                {form.coverImage && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
              <label className="block text-gray-300 text-sm font-medium mb-3 flex items-center gap-1.5">
                <Tag size={13} className="text-[#C9A84C]" /> 分类标签
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setUseCustomCat(false); setForm((p) => ({ ...p, category: cat })); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      !useCustomCat && form.category === cat
                        ? "bg-[#C9A84C] text-black"
                        : "bg-[#0F1117] border border-gray-600 text-gray-300 hover:border-[#C9A84C]/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setUseCustomCat(true)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    useCustomCat ? "bg-[#C9A84C] text-black" : "bg-[#0F1117] border border-gray-600 text-gray-300 hover:border-[#C9A84C]/50"
                  }`}
                >
                  自定义
                </button>
              </div>
              {useCustomCat && (
                <input
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value)}
                  placeholder="输入自定义分类..."
                  className="w-full px-3 py-2 bg-[#0F1117] border border-[#C9A84C]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              )}
            </div>

            {/* Visibility */}
            <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-gray-300 text-sm">显示此攻略（在网站上可见）</span>
              </label>
            </div>
          </>
        )}

        {/* Rich Text Content */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-3">
            {activeTab === "zh" ? "正文内容（中文）" : "Guide Content (English)"}
          </label>
          <TiptapEditor
            key={activeTab}
            value={activeTab === "zh" ? form.contentZh : form.contentEn}
            onChange={(html) => setForm({ ...form, [activeTab === "zh" ? "contentZh" : "contentEn"]: html })}
            placeholder={activeTab === "zh" ? "在此输入攻略正文内容..." : "Enter guide content here..."}
          />
          <p className="text-gray-500 text-xs mt-2">支持富文本格式：粗体、斜体、标题、列表、链接、图片等</p>
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 flex justify-end gap-3 py-4 border-t border-gray-700/50 bg-[#0F1117]/80 backdrop-blur-sm -mx-6 px-6">
        <Link
          href="/admin/guides"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors"
        >
          返回列表
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !form.titleZh.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "保存中..." : "保存攻略"}
        </button>
      </div>
    </div>
  );
}
