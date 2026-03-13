import { prisma } from "@/lib/db";
import { Users, Newspaper, Image, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [heroCount, newsCount, mediaCount, publishedNews] = await Promise.all([
    prisma.hero.count(),
    prisma.news.count(),
    prisma.mediaFile.count(),
    prisma.news.count({ where: { isPublished: true } }),
  ]);
  return { heroCount, newsCount, mediaCount, publishedNews };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "英雄总数",
      value: stats.heroCount,
      icon: Users,
      href: "/admin/heroes",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      title: "资讯文章",
      value: stats.newsCount,
      icon: Newspaper,
      href: "/admin/news",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      title: "已发布",
      value: stats.publishedNews,
      icon: TrendingUp,
      href: "/admin/news",
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    {
      title: "媒体文件",
      value: stats.mediaCount,
      icon: Image,
      href: "/admin/media",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
  ];

  const quickActions = [
    { label: "添加英雄", href: "/admin/heroes", desc: "新增英雄角色" },
    { label: "写新文章", href: "/admin/news", desc: "发布游戏资讯" },
    { label: "上传媒体", href: "/admin/media", desc: "管理图片资源" },
    { label: "编辑版块", href: "/admin/sections", desc: "更新页面内容" },
    { label: "站点设置", href: "/admin/settings", desc: "修改全局配置" },
    { label: "账号管理", href: "/admin/accounts", desc: "管理管理员" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">控制台</h1>
        <p className="text-gray-400 text-sm mt-1">欢迎使用帝国纪元内容管理系统</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`group relative p-5 bg-[#1A1D26] border ${card.border} rounded-xl hover:border-opacity-60 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <div className={`mt-3 flex items-center gap-1 text-xs ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`}>
              <span>查看详情</span>
              <ArrowRight size={10} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group p-3 bg-[#0F1117] border border-gray-700/50 rounded-lg hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all"
              >
                <div className="text-white text-sm font-medium group-hover:text-[#E8C96A] transition-colors">
                  {action.label}
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* System info */}
        <div className="bg-[#1A1D26] border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">系统信息</h2>
          <div className="space-y-3">
            {[
              { label: "系统版本", value: "v1.0.0" },
              { label: "数据库", value: "SQLite (Prisma 7)" },
              { label: "框架", value: "Next.js 16 + TypeScript" },
              { label: "状态", value: "运行中", status: "ok" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-400 text-sm">{item.label}</span>
                <span className={`text-sm font-medium ${item.status === "ok" ? "text-green-400" : "text-gray-300"}`}>
                  {item.status === "ok" && (
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5" />
                  )}
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
