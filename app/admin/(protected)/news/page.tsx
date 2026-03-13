"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar } from "lucide-react";

interface NewsItem {
  id: string;
  titleZh: string;
  titleEn?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNews = useCallback(async () => {
    const res = await fetch("/api/news?admin=1");
    const data = await res.json();
    setNews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("确认删除该文章?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    await fetchNews();
  };

  const togglePublish = async (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    await fetch(`/api/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isPublished: !item.isPublished,
        publishedAt: !item.isPublished ? new Date().toISOString() : null,
      }),
    });
    await fetchNews();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">资讯管理</h1>
          <p className="text-gray-400 text-sm mt-0.5">{news.length} 篇文章</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus size={16} />
          写新文章
        </Link>
      </div>

      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">加载中...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">标题</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">状态</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">发布时间</th>
                <th className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">更新时间</th>
                <th className="text-right px-4 py-3 text-gray-400 text-xs font-medium uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    暂无文章，点击右上角添加
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/admin/news/${item.id}`)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium truncate max-w-xs hover:text-[#E8C96A] transition-colors">
                        {item.titleZh}
                      </div>
                      {item.titleEn && (
                        <div className="text-gray-400 text-xs truncate max-w-xs">{item.titleEn}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.isPublished
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {item.isPublished ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.publishedAt ? (
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar size={12} />
                          {formatDate(item.publishedAt)}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => togglePublish(e, item)}
                          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-all"
                          title={item.isPublished ? "取消发布" : "发布"}
                        >
                          {item.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/news/${item.id}`);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#E8C96A] rounded hover:bg-[#C9A84C]/10 transition-all"
                          title="编辑"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-400/10 transition-all"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
