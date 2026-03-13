"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown,
  Eye, EyeOff, BookOpen, Pencil,
} from "lucide-react";

interface Guide {
  id: string;
  titleZh: string;
  titleEn?: string;
  excerptZh?: string;
  category?: string;
  coverImage?: string;
  isVisible: boolean;
  order: number;
}

// ---- Category badge colors ----
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
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">加载中...</div>;

  return (
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
          onClick={() => router.push("/admin/guides/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />新建攻略
        </button>
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-2xl">
          <BookOpen size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">暂无攻略，点击右上角新建</p>
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
                      <span className="text-white font-medium text-sm truncate">{guide.titleZh}</span>
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
                    <button
                      onClick={() => router.push(`/admin/guides/${guide.id}`)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                      title="编辑"
                    >
                      <Pencil size={15} />
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
  );
}
