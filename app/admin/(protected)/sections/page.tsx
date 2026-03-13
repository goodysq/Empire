"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save, ChevronDown, ChevronUp, Plus, Trash2,
  Lock, Unlock, GripVertical, X, Navigation,
} from "lucide-react";

interface PageSection {
  id: string;
  key: string;
  titleZh?: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  contentZh?: string;
  contentEn?: string;
  imageUrl?: string;
  isVisible: boolean;
  isLocked: boolean;
  showInNav: boolean;
  order: number;
}

const systemSectionLabels: Record<string, string> = {
  hero: "首页 Hero",
  features: "特色功能",
  heroes_gallery: "英雄图鉴",
  world: "世界观",
  news: "最新资讯",
  guides: "攻略中心",
  download: "下载区域",
};

const SYSTEM_KEYS = new Set(Object.keys(systemSectionLabels));

function AddSectionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (key: string, titleZh: string) => void }) {
  const [key, setKey] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    if (!cleanKey) { setError("请输入板块 Key"); return; }
    if (!/^[a-z0-9_]+$/.test(cleanKey)) { setError("Key 只能包含小写字母、数字和下划线"); return; }
    onAdd(cleanKey, titleZh.trim() || cleanKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1D26] border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">添加新板块</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              板块 Key <span className="text-gray-500 text-xs">(英文唯一标识)</span>
            </label>
            <input
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(""); }}
              placeholder="如：guides / faq / team"
              className="w-full px-3 py-2.5 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">板块名称（中文）</label>
            <input
              value={titleZh}
              onChange={(e) => setTitleZh(e.target.value)}
              placeholder="如：攻略中心"
              className="w-full px-3 py-2.5 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors">取消</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors">添加</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SectionsAdminPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [localData, setLocalData] = useState<Record<string, Partial<PageSection>>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragSourceRef = useRef<string | null>(null);

  const fetchSections = useCallback(async () => {
    const res = await fetch("/api/sections");
    const data: PageSection[] = await res.json();
    setSections(data);
    const initial: Record<string, Partial<PageSection>> = {};
    data.forEach((s) => { initial[s.key] = { ...s }; });
    setLocalData(initial);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const pushOrder = async (reordered: PageSection[]) => {
    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    setSections(updated);
    await fetch("/api/sections/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map(({ key, order }) => ({ key, order }))),
    });
  };

  /* ---- Drag handlers (HTML5 DnD) ---- */
  const handleDragStart = (e: React.DragEvent, key: string) => {
    dragSourceRef.current = key;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
    setTimeout(() => setDraggingKey(key), 0);
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverKey !== key) setDragOverKey(key);
  };

  const handleDrop = async (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    const src = dragSourceRef.current ?? e.dataTransfer.getData("text/plain");
    setDraggingKey(null);
    setDragOverKey(null);
    dragSourceRef.current = null;
    if (!src || src === targetKey) return;
    const from = sections.findIndex((s) => s.key === src);
    const to = sections.findIndex((s) => s.key === targetKey);
    if (from === -1 || to === -1) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    await pushOrder(reordered);
  };

  const handleDragEnd = () => {
    setDraggingKey(null);
    setDragOverKey(null);
    dragSourceRef.current = null;
  };

  /* ---- Arrow buttons (reliable fallback) ---- */
  const handleMove = async (index: number, dir: "up" | "down") => {
    const next = dir === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= sections.length) return;
    const reordered = [...sections];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    await pushOrder(reordered);
  };

  /* ---- CRUD ---- */
  const handleSave = async (key: string) => {
    setSaving(key);
    await fetch(`/api/sections/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localData[key]),
    });
    await fetchSections();
    setSaving(null);
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`确认删除板块「${key}」？此操作不可恢复。`)) return;
    const res = await fetch(`/api/sections/${key}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "删除失败"); return; }
    await fetchSections();
    if (expanded === key) setExpanded(null);
  };

  const handleToggleLock = async (section: PageSection) => {
    await fetch(`/api/sections/${section.key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...localData[section.key], isLocked: !section.isLocked }),
    });
    await fetchSections();
  };

  const handleAddSection = async (key: string, titleZh: string) => {
    const res = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, titleZh }),
    });
    if (!res.ok) { const d = await res.json(); alert(d.error || "添加失败"); return; }
    setShowAddModal(false);
    await fetchSections();
    setExpanded(key);
  };

  const updateField = (key: string, field: keyof PageSection, value: string | boolean) => {
    setLocalData((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">加载中...</div>;

  return (
    <>
      {showAddModal && <AddSectionModal onClose={() => setShowAddModal(false)} onAdd={handleAddSection} />}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">版块管理</h1>
            <p className="text-gray-400 text-sm mt-0.5">拖拽或点击 ↑↓ 调整在官网的显示顺序</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
          >
            <Plus size={16} />添加板块
          </button>
        </div>

        <div className="space-y-2">
          {sections.map((section, index) => {
            const isOpen = expanded === section.key;
            const local = localData[section.key] || {};
            const label = systemSectionLabels[section.key] || local.titleZh || section.key;
            const isSystem = SYSTEM_KEYS.has(section.key);
            const isDraggingThis = draggingKey === section.key;
            const isDragTarget = dragOverKey === section.key && draggingKey !== section.key;

            return (
              <div
                key={section.key}
                draggable
                onDragStart={(e) => handleDragStart(e, section.key)}
                onDragOver={(e) => handleDragOver(e, section.key)}
                onDrop={(e) => handleDrop(e, section.key)}
                onDragEnd={handleDragEnd}
                className={`bg-[#1A1D26] border rounded-xl overflow-hidden transition-all ${
                  isDraggingThis ? "opacity-40 scale-[0.98] border-[#C9A84C]/50"
                    : isDragTarget ? "border-[#C9A84C] ring-1 ring-[#C9A84C]/30"
                    : "border-gray-700/50"
                }`}
              >
                {/* Row header */}
                <div className="flex items-center gap-2 px-3 py-3">
                  {/* Drag grip */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 flex-shrink-0 px-1" title="拖拽排序">
                    <GripVertical size={16} />
                  </div>

                  {/* ↑↓ arrow buttons */}
                  <div className="flex flex-col flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMove(index, "up"); }}
                      disabled={index === 0}
                      className="p-0.5 text-gray-500 hover:text-[#C9A84C] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="上移"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMove(index, "down"); }}
                      disabled={index === sections.length - 1}
                      className="p-0.5 text-gray-500 hover:text-[#C9A84C] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="下移"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Label + badges */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : section.key)}
                    className="flex-1 flex items-center gap-2 text-left hover:opacity-80 transition-opacity min-w-0"
                  >
                    <span className="text-white font-medium text-sm truncate">{label}</span>
                    <span className="text-xs text-gray-500 font-mono flex-shrink-0">{section.key}</span>
                    {isSystem && (
                      <span className="hidden sm:inline px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 flex-shrink-0">系统</span>
                    )}
                    {!section.isVisible && (
                      <span className="px-1.5 py-0.5 bg-gray-600/30 text-gray-400 text-xs rounded flex-shrink-0">隐藏</span>
                    )}
                    {section.showInNav && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20 flex items-center gap-1 flex-shrink-0">
                        <Navigation size={10} />导航栏
                      </span>
                    )}
                    {section.isLocked && (
                      <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded border border-orange-500/20 flex items-center gap-1 flex-shrink-0">
                        <Lock size={10} />已锁定
                      </span>
                    )}
                  </button>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleLock(section)}
                      className={`p-1.5 rounded transition-all ${section.isLocked ? "text-orange-400 hover:text-orange-300 hover:bg-orange-400/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/10"}`}
                      title={section.isLocked ? "解锁" : "锁定"}
                    >
                      {section.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    {!isSystem && (
                      <button
                        onClick={() => handleDelete(section.key)}
                        disabled={section.isLocked}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setExpanded(isOpen ? null : section.key)}
                      className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-all"
                    >
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className={`px-5 pb-5 border-t border-gray-700/50 pt-4 space-y-4 ${section.isLocked ? "pointer-events-none opacity-60" : ""}`}>
                    {section.isLocked && (
                      <div className="flex items-center gap-2 text-orange-400 text-xs bg-orange-400/10 border border-orange-400/20 rounded-lg px-3 py-2">
                        <Lock size={12} />此板块已锁定，解锁后方可编辑
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">标题（中文）</label>
                        <input value={local.titleZh || ""} onChange={(e) => updateField(section.key, "titleZh", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">标题（英文）</label>
                        <input value={local.titleEn || ""} onChange={(e) => updateField(section.key, "titleEn", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">副标题（中文）</label>
                        <input value={local.subtitleZh || ""} onChange={(e) => updateField(section.key, "subtitleZh", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">副标题（英文）</label>
                        <input value={local.subtitleEn || ""} onChange={(e) => updateField(section.key, "subtitleEn", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">内容（中文）</label>
                        <textarea rows={4} value={local.contentZh || ""} onChange={(e) => updateField(section.key, "contentZh", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-medium mb-1.5">内容（英文）</label>
                        <textarea rows={4} value={local.contentEn || ""} onChange={(e) => updateField(section.key, "contentEn", e.target.value)}
                          className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C] resize-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs font-medium mb-1.5">图片 URL</label>
                      <input value={local.imageUrl || ""} onChange={(e) => updateField(section.key, "imageUrl", e.target.value)}
                        className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-5 flex-wrap">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={local.isVisible ?? true}
                            onChange={(e) => updateField(section.key, "isVisible", e.target.checked)}
                            className="w-4 h-4 accent-[#C9A84C]" />
                          <span className="text-gray-300 text-sm">显示此板块</span>
                        </label>

                        {/* Only custom (non-system) sections can appear in nav */}
                        {!isSystem && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={local.showInNav ?? false}
                              onChange={(e) => updateField(section.key, "showInNav", e.target.checked)}
                              className="w-4 h-4 accent-[#C9A84C]" />
                            <span className="text-gray-300 text-sm flex items-center gap-1">
                              <Navigation size={13} className="text-green-400" />
                              显示在顶部导航
                            </span>
                          </label>
                        )}
                      </div>
                      <button
                        onClick={() => handleSave(section.key)}
                        disabled={saving === section.key || section.isLocked}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save size={14} />
                        {saving === section.key ? "保存中..." : "保存"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {sections.length === 0 && <div className="text-center py-16 text-gray-500">暂无版块，点击右上角添加</div>}
      </div>
    </>
  );
}
