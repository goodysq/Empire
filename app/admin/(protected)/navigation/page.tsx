"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff } from "lucide-react";

interface NavItem {
  id: string;
  labelZh: string;
  labelEn: string;
  href: string;
  order: number;
  isVisible: boolean;
}

const defaultItem: Omit<NavItem, "id"> = {
  labelZh: "",
  labelEn: "",
  href: "#",
  order: 0,
  isVisible: true,
};

export default function NavigationAdminPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NavItem>>(defaultItem);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/navigation");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openAdd = () => {
    setEditingItem({ ...defaultItem, order: items.length });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEdit = (item: NavItem) => {
    setEditingItem(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = isEditing ? `/api/navigation` : "/api/navigation";
    const method = isEditing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingItem),
    });
    await fetchItems();
    setModalOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除?")) return;
    await fetch(`/api/navigation`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchItems();
  };

  const toggleVisibility = async (item: NavItem) => {
    await fetch("/api/navigation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isVisible: !item.isVisible }),
    });
    await fetchItems();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">导航管理</h1>
          <p className="text-gray-400 text-sm mt-0.5">管理网站导航菜单</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          添加菜单项
        </button>
      </div>

      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">加载中...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase w-8"></th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">标签（中）</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">标签（英）</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">链接</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">排序</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">状态</th>
                <th className="text-right px-4 py-3 text-gray-400 text-xs font-medium uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <GripVertical size={14} className="text-gray-600" />
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{item.labelZh}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{item.labelEn}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm font-mono">{item.href}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{item.order}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${item.isVisible ? "bg-green-400/10 text-green-400" : "bg-gray-600/20 text-gray-400"}`}>
                      {item.isVisible ? "显示" : "隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleVisibility(item)} className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10">
                        {item.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-[#E8C96A] rounded hover:bg-[#C9A84C]/10">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-400/10">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#1A1D26] border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">{isEditing ? "编辑菜单项" : "添加菜单项"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">中文标签</label>
                  <input
                    value={editingItem.labelZh || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, labelZh: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">英文标签</label>
                  <input
                    value={editingItem.labelEn || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, labelEn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">链接</label>
                <input
                  value={editingItem.href || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                  placeholder="#heroes"
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">排序</label>
                  <input
                    type="number"
                    value={editingItem.order || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isVisible ?? true}
                      onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-gray-300 text-sm">显示</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-700">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-white/5">取消</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold rounded-lg text-sm disabled:opacity-50">
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
