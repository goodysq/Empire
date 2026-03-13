"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Save, Trash2, GripVertical, ChevronUp, ChevronDown,
  Eye, EyeOff, X, BookOpen, Tag, Image as ImageIcon,
} from "lucide-react";

interface Guide {
  id: string;
  titleZh: string;
  titleEn?: string;
  excerptZh?: string;
  excerptEn?: string;
  coverImage?: string;
  category?: string;
  isVisible: boolean;
  order: number;
}

const CATEGORY_PRESETS = ["新手入门", "英雄攻略", "战斗技巧", "联盟策略", "资源管理", "活动攻略"];

// ---- Add/Edit Modal ----
function GuideModal({
  guide,
  onClose,
  onSave,
}: {
  guide?: Partial<Guide>;
  onClose: () => void;
  onSave: (data: Partial<Guide>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Guide>>({
    titleZh: "",
    titleEn: "",
    excerptZh: "",
    excerptEn: "",
    coverImage: "",
    category: "",
    isVisible: true,
    ...guide,
  });
  const [saving, setSaving] = useState(false);
  const [customCat, setCustomCat] = useState(
    guide?.category && !CATEGORY_PRESETS.includes(guide.category) ? guide.category : ""
  );
  const [useCustom, setUseCustom] = useState(
    !!(guide?.category && !CATEGORY_PRESETS.includes(guide.category))
  );

  const set = (field: keyof Guide, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleZh?.trim()) return;
    setSaving(true);
    const finalCategory = useCustom ? customCat : form.category;
    await onSave({ ...form, category: finalCategory });
    setSaving(false);
  };

  const isEdit = !!guide?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1D26] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <BookOpen size={18} className="text-[#C9A84C]" />
            {isEdit ? "编辑攻略" : "添加攻略"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cover image preview */}
          {form.coverImage && (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <ImageIcon size={12} className="text-[#C9A84C]" />
              封面图片 URL
            </label>
            <input
              value={form.coverImage || ""}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-1.5">标题（中文）<span className="text-red-400 ml-0.5">*</span></label>
              <input
                value={form.titleZh || ""}
                onChange={(e) => set("titleZh", e.target.value)}
                required
                placeholder="如：新手入门完全指南"
                className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-1.5">标题（英文）</label>
              <input
                value={form.titleEn || ""}
                onChange={(e) => set("titleEn", e.target.value)}
                placeholder="Beginner's Complete Guide"
                className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Tag size={12} className="text-[#C9A84C]" />
              分类标签
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setUseCustom(false); set("category", cat); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    !useCustom && form.category === cat
                      ? "bg-[#C9A84C] text-black"
                      : "bg-[#0F1117] border border-gray-600 text-gray-300 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustom(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  useCustom
                    ? "bg-[#C9A84C] text-black"
                    : "bg-[#0F1117] border border-gray-600 text-gray-300 hover:border-[#C9A84C]/50"
                }`}
              >
                自定义
              </button>
            </div>
            {useCustom && (
              <input
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value)}
                placeholder="输入自定义分类..."
                className="w-full px-3 py-2 bg-[#0F1117] border border-[#C9A84C]/50 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-1.5">简介（中文）</label>
              <textarea
                rows={3}
                value={form.excerptZh || ""}
                onChange={(e) => set("excerptZh", e.target.value)}
                placeholder="简短描述此篇攻略的内容..."
                className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs font-medium mb-1.5">简介（英文）</label>
              <textarea
                rows={3}
                value={form.excerptEn || ""}
                onChange={(e) => set("excerptEn", e.target.value)}
                placeholder="Brief description..."
                className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVisible ?? true}
                onChange={(e) => set("isVisible", e.target.checked)}
                className="w-4 h-4 accent-[#C9A84C]"
              />
              <span className="text-gray-300 text-sm">显示此攻略</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors">
                取消
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50">
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Category badge ----
const CAT_COLORS: Record<string, string> = {
  "新手入门": "bg-green-500/20 text-green-400 border-green-500/30",
  "英雄攻略": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "战斗技巧": "bg-red-500/20 text-red-400 border-red-500/30",
  "联盟策略": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "资源管理": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "活动攻略": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};
const defaultCatColor = "bg-gray-500/20 text-gray-400 border-gray-500/30";

// ---- Main Page ----
export default function GuidesAdminPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; guide?: Guide }>({ open: false });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragRef = useRef<string | null>(null);

  const fetchGuides = useCallback(async () => {
    const res = await fetch("/api/guides?all=true");
    const data: Guide[] = await res.json();
    setGuides(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGuides(); }, [fetchGuides]);

  const pushOrder = async (reordered: Guide[]) => {
    const updated = reordered.map((g, i) => ({ ...g, order: i }));
    setGuides(updated);
    await fetch("/api/guides/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map(({ id, order }) => ({ id, order }))),
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setTimeout(() => setDraggingId(id), 0);
  };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverId !== id) setDragOverId(id);
  };
  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const src = dragRef.current ?? e.dataTransfer.getData("text/plain");
    setDraggingId(null); setDragOverId(null); dragRef.current = null;
    if (!src || src === targetId) return;
    const from = guides.findIndex((g) => g.id === src);
    const to = guides.findIndex((g) => g.id === targetId);
    if (from === -1 || to === -1) return;
    const arr = [...guides];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    await pushOrder(arr);
  };
  const handleDragEnd = () => { setDraggingId(null); setDragOverId(null); dragRef.current = null; };

  const handleMove = async (index: number, dir: "up" | "down") => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= guides.length) return;
    const arr = [...guides];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    await pushOrder(arr);
  };

  const handleToggleVisible = async (guide: Guide) => {
    await fetch(`/api/guides/${guide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...guide, isVisible: !guide.isVisible }),
    });
    await fetchGuides();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除此攻略？")) return;
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    await fetchGuides();
  };

  const handleSave = async (data: Partial<Guide>) => {
    if (data.id) {
      await fetch(`/api/guides/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModal({ open: false });
    await fetchGuides();
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">加载中...</div>;

  return (
    <>
      {modal.open && (
        <GuideModal
          guide={modal.guide}
          onClose={() => setModal({ open: false })}
          onSave={handleSave}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-[#C9A84C]" />
              攻略管理
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">拖拽或点击 ↑↓ 调整显示顺序</p>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
          >
            <Plus size={16} />添加攻略
          </button>
        </div>

        {guides.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-700 rounded-2xl">
            <BookOpen size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">暂无攻略，点击右上角添加</p>
          </div>
        ) : (
          <div className="space-y-2">
            {guides.map((guide, index) => {
              const catColor = CAT_COLORS[guide.category ?? ""] ?? defaultCatColor;
              const isDragging = draggingId === guide.id;
              const isDragTarget = dragOverId === guide.id && draggingId !== guide.id;

              return (
                <div
                  key={guide.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, guide.id)}
                  onDragOver={(e) => handleDragOver(e, guide.id)}
                  onDrop={(e) => handleDrop(e, guide.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-[#1A1D26] border rounded-xl overflow-hidden transition-all ${
                    isDragging ? "opacity-40 scale-[0.98] border-[#C9A84C]/50"
                      : isDragTarget ? "border-[#C9A84C] ring-1 ring-[#C9A84C]/30"
                      : "border-gray-700/50"
                  } ${!guide.isVisible ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Grip */}
                    <div className="cursor-grab text-gray-600 hover:text-gray-400 flex-shrink-0 px-1" title="拖拽排序">
                      <GripVertical size={16} />
                    </div>

                    {/* Up/Down */}
                    <div className="flex flex-col flex-shrink-0">
                      <button onClick={() => handleMove(index, "up")} disabled={index === 0}
                        className="p-0.5 text-gray-600 hover:text-[#C9A84C] disabled:opacity-20" title="上移">
                        <ChevronUp size={14} />
                      </button>
                      <button onClick={() => handleMove(index, "down")} disabled={index === guides.length - 1}
                        className="p-0.5 text-gray-600 hover:text-[#C9A84C] disabled:opacity-20" title="下移">
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* Cover thumbnail */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#0F1117] border border-gray-700">
                      {guide.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={guide.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={16} className="text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-white font-medium text-sm truncate`}>{guide.titleZh}</span>
                        {guide.category && (
                          <span className={`px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${catColor}`}>
                            {guide.category}
                          </span>
                        )}
                        {!guide.isVisible && (
                          <span className="px-1.5 py-0.5 bg-gray-600/30 text-gray-400 text-xs rounded flex-shrink-0">已隐藏</span>
                        )}
                      </div>
                      {guide.excerptZh && (
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{guide.excerptZh}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleToggleVisible(guide)}
                        className={`p-1.5 rounded transition-all ${guide.isVisible ? "text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10" : "text-gray-600 hover:text-green-400 hover:bg-green-400/10"}`}
                        title={guide.isVisible ? "隐藏" : "显示"}>
                        {guide.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => setModal({ open: true, guide })}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all" title="编辑">
                        <Save size={15} />
                      </button>
                      <button onClick={() => handleDelete(guide.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all" title="删除">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
