"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";

interface Hero {
  id: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string;
  titleEn?: string;
  faction?: string;
  imageUrl: string;
  isVisible: boolean;
  order: number;
}

const factions = [
  { value: "asia", labelZh: "亚洲", labelEn: "Asia" },
  { value: "europe", labelZh: "欧洲", labelEn: "Europe" },
  { value: "middleeast", labelZh: "中东", labelEn: "Middle East" },
];

const defaultHero: Omit<Hero, "id"> = {
  nameZh: "",
  nameEn: "",
  titleZh: "",
  titleEn: "",
  faction: "asia",
  imageUrl: "",
  isVisible: true,
  order: 0,
};

export default function HeroesAdminPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Partial<Hero>>(defaultHero);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchHeroes = useCallback(async () => {
    const res = await fetch("/api/heroes?all=true");
    const data = await res.json();
    setHeroes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const openAdd = () => {
    setEditingHero(defaultHero);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEdit = (hero: Hero) => {
    setEditingHero(hero);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isEditing ? `/api/heroes/${editingHero.id}` : "/api/heroes";
      const method = isEditing ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingHero),
      });
      await fetchHeroes();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除该英雄?")) return;
    await fetch(`/api/heroes/${id}`, { method: "DELETE" });
    await fetchHeroes();
  };

  const toggleVisibility = async (hero: Hero) => {
    await fetch(`/api/heroes/${hero.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...hero, isVisible: !hero.isVisible }),
    });
    await fetchHeroes();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">英雄管理</h1>
          <p className="text-gray-400 text-sm mt-0.5">{heroes.length} 位英雄</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          添加英雄
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            加载中...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">英雄</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">阵营</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">排序</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">状态</th>
                <th className="text-right px-4 py-3 text-gray-400 text-xs font-medium uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {heroes.map((hero) => (
                <tr key={hero.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 rounded overflow-hidden bg-[#0F1117] flex-shrink-0">
                        {hero.imageUrl && (
                          <Image
                            src={hero.imageUrl}
                            alt={hero.nameEn}
                            fill
                            className="object-cover object-top"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{hero.nameZh}</div>
                        <div className="text-gray-400 text-xs">{hero.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">
                      {factions.find((f) => f.value === hero.faction)?.labelZh || hero.faction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{hero.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        hero.isVisible
                          ? "bg-green-400/10 text-green-400"
                          : "bg-gray-400/10 text-gray-400"
                      }`}
                    >
                      {hero.isVisible ? "显示" : "隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleVisibility(hero)}
                        className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-all"
                        title={hero.isVisible ? "隐藏" : "显示"}
                      >
                        {hero.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(hero)}
                        className="p-1.5 text-gray-400 hover:text-[#E8C96A] rounded hover:bg-[#C9A84C]/10 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(hero.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1A1D26] border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">
                {isEditing ? "编辑英雄" : "添加英雄"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">中文名 *</label>
                  <input
                    value={editingHero.nameZh || ""}
                    onChange={(e) => setEditingHero({ ...editingHero, nameZh: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">英文名 *</label>
                  <input
                    value={editingHero.nameEn || ""}
                    onChange={(e) => setEditingHero({ ...editingHero, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">中文称号</label>
                  <input
                    value={editingHero.titleZh || ""}
                    onChange={(e) => setEditingHero({ ...editingHero, titleZh: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">英文称号</label>
                  <input
                    value={editingHero.titleEn || ""}
                    onChange={(e) => setEditingHero({ ...editingHero, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">阵营</label>
                <select
                  value={editingHero.faction || "asia"}
                  onChange={(e) => setEditingHero({ ...editingHero, faction: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  {factions.map((f) => (
                    <option key={f.value} value={f.value}>{f.labelZh}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">图片路径 *</label>
                <input
                  value={editingHero.imageUrl || ""}
                  onChange={(e) => setEditingHero({ ...editingHero, imageUrl: e.target.value })}
                  placeholder="/art/characters/..."
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">排序</label>
                  <input
                    type="number"
                    value={editingHero.order || 0}
                    onChange={(e) => setEditingHero({ ...editingHero, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingHero.isVisible ?? true}
                      onChange={(e) => setEditingHero({ ...editingHero, isVisible: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-gray-300 text-sm">显示</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
