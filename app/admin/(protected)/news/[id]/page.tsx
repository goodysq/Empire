"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Load Tiptap editor only on client
const TiptapEditor = dynamic(() => import("@/components/admin/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] bg-[#0F1117] border border-gray-600 rounded-lg animate-pulse" />
  ),
});

interface NewsForm {
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  coverImage: string;
  isPublished: boolean;
}

const defaultForm: NewsForm = {
  titleZh: "",
  titleEn: "",
  excerptZh: "",
  excerptEn: "",
  contentZh: "",
  contentEn: "",
  coverImage: "",
  isPublished: false,
};

export default function NewsEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const [form, setForm] = useState<NewsForm>(defaultForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"zh" | "en">("zh");
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/news/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            titleZh: data.titleZh || "",
            titleEn: data.titleEn || "",
            excerptZh: data.excerptZh || "",
            excerptEn: data.excerptEn || "",
            contentZh: data.contentZh || "",
            contentEn: data.contentEn || "",
            coverImage: data.coverImage || "",
            isPublished: data.isPublished || false,
          });
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    const payload = {
      ...form,
      isPublished: publish !== undefined ? publish : form.isPublished,
      publishedAt: publish ? new Date().toISOString() : undefined,
    };

    try {
      const url = isNew ? "/api/news" : `/api/news/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (isNew && data.id) {
        router.push(`/admin/news/${data.id}`);
      } else {
        setForm((prev) => ({ ...prev, ...payload }));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        加载中...
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isNew ? "新建文章" : "编辑文章"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            保存草稿
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <Eye size={14} />
            发布
          </button>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
            form.isPublished
              ? "bg-green-400/10 text-green-400 border border-green-400/20"
              : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
          }`}
        >
          {form.isPublished ? "已发布" : "草稿"}
        </span>
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

      {/* Form */}
      <div className="space-y-4">
        {/* Title */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {activeTab === "zh" ? "文章标题（中文）" : "Article Title (English)"}
          </label>
          <input
            value={activeTab === "zh" ? form.titleZh : form.titleEn}
            onChange={(e) =>
              setForm({
                ...form,
                [activeTab === "zh" ? "titleZh" : "titleEn"]: e.target.value,
              })
            }
            placeholder={activeTab === "zh" ? "输入中文标题..." : "Enter English title..."}
            className="w-full px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-base focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>

        {/* Excerpt */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            {activeTab === "zh" ? "文章摘要（中文）" : "Article Excerpt (English)"}
          </label>
          <textarea
            rows={3}
            value={activeTab === "zh" ? form.excerptZh : form.excerptEn}
            onChange={(e) =>
              setForm({
                ...form,
                [activeTab === "zh" ? "excerptZh" : "excerptEn"]: e.target.value,
              })
            }
            placeholder={activeTab === "zh" ? "输入文章摘要..." : "Enter article excerpt..."}
            className="w-full px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
          />
        </div>

        {/* Cover image */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">封面图片 URL</label>
          <div className="flex gap-3">
            <input
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="/art/... 或 https://..."
              className="flex-1 px-4 py-3 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
            {form.coverImage && (
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImage}
                  alt="cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content — Rich Text Editor */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <label className="block text-gray-300 text-sm font-medium mb-3">
            {activeTab === "zh" ? "正文内容（中文）" : "Article Content (English)"}
          </label>
          <TiptapEditor
            key={activeTab}
            value={activeTab === "zh" ? form.contentZh : form.contentEn}
            onChange={(html) =>
              setForm({
                ...form,
                [activeTab === "zh" ? "contentZh" : "contentEn"]: html,
              })
            }
            placeholder={
              activeTab === "zh" ? "在此输入文章正文内容..." : "Enter article content here..."
            }
          />
          <p className="text-gray-500 text-xs mt-2">支持富文本格式：粗体、斜体、标题、列表、链接、图片等</p>
        </div>
      </div>

      {/* Bottom save bar */}
      <div className="sticky bottom-0 flex justify-end gap-3 py-4 border-t border-gray-700/50 bg-[#0F1117]/80 backdrop-blur-sm -mx-6 px-6">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          保存草稿
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Eye size={14} />
          {saving ? "保存中..." : "发布"}
        </button>
      </div>
    </div>
  );
}
