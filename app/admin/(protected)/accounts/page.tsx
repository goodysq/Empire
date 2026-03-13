"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, User, Shield } from "lucide-react";

interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AccountForm {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

const defaultForm: AccountForm = {
  name: "",
  email: "",
  password: "",
  role: "editor",
  isActive: true,
};

export default function AccountsAdminPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AccountForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAccounts = useCallback(async () => {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (account: Account) => {
    setForm({
      name: account.name,
      email: account.email,
      password: "",
      role: account.role,
      isActive: account.isActive,
    });
    setEditingId(account.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editingId ? `/api/accounts/${editingId}` : "/api/accounts";
    const method = editingId ? "PUT" : "POST";
    const body: Partial<AccountForm> = { ...form };
    if (editingId && !form.password) delete body.password;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetchAccounts();
    setModalOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除该账号?")) return;
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    await fetchAccounts();
  };

  const toggleActive = async (account: Account) => {
    await fetch(`/api/accounts/${account.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !account.isActive }),
    });
    await fetchAccounts();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">账号管理</h1>
          <p className="text-gray-400 text-sm mt-0.5">{accounts.length} 个管理员账号</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          添加账号
        </button>
      </div>

      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">加载中...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">用户</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">角色</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">状态</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">创建时间</th>
                <th className="text-right px-4 py-3 text-gray-400 text-xs font-medium uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center">
                        <User size={14} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{account.name}</div>
                        <div className="text-gray-400 text-xs">{account.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      account.role === "admin"
                        ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20"
                        : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                    }`}>
                      <Shield size={10} />
                      {account.role === "admin" ? "管理员" : "编辑"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      account.isActive
                        ? "bg-green-400/10 text-green-400"
                        : "bg-red-400/10 text-red-400"
                    }`}>
                      {account.isActive ? "激活" : "禁用"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {new Date(account.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(account)}
                        className="px-2 py-1 text-xs border border-gray-600 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-all"
                      >
                        {account.isActive ? "禁用" : "激活"}
                      </button>
                      <button
                        onClick={() => openEdit(account)}
                        className="p-1.5 text-gray-400 hover:text-[#E8C96A] rounded hover:bg-[#C9A84C]/10"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-400/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#1A1D26] border border-gray-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">{editingId ? "编辑账号" : "添加账号"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">姓名</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1.5">
                  密码{editingId && " (留空则不修改)"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingId ? "留空保持原密码" : "输入密码"}
                  className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">角色</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0F1117] border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="editor">编辑</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-gray-300 text-sm">激活</span>
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
