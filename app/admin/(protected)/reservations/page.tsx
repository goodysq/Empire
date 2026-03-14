"use client";

import { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";

interface ReservationItem {
  id: string;
  email: string;
  createdAt: string;
}

interface PageData {
  items: ReservationItem[];
  total: number;
  page: number;
  pageSize: number;
}

export default function ReservationsAdminPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/reservations?page=${p}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handleExport = async () => {
    setExporting(true);
    const res = await fetch("/api/reservations/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reservations.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">预约管理</h1>
          {data && (
            <p className="text-sm text-gray-400 mt-0.5">
              共 <span className="text-[#E8C96A] font-semibold">{data.total}</span> 人预约
            </p>
          )}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || !data?.total}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8C96A] rounded-lg text-sm font-medium hover:bg-[#C9A84C]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={15} />
          {exporting ? "导出中..." : "导出 CSV"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">邮箱</th>
              <th className="text-left px-5 py-3.5 text-gray-400 font-medium">预约时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                  暂无预约数据
                </td>
              </tr>
            ) : (
              data?.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700/30 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-3.5 text-gray-200 font-mono text-xs">{item.email}</td>
                  <td className="px-5 py-3.5 text-gray-400">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-700/50 rounded-lg hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-700/50 rounded-lg hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
