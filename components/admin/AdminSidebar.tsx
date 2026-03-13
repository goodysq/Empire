"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Image,
  Navigation,
  Settings,
  UserCog,
  Layers,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/heroes", icon: Users, label: "英雄管理" },
  { href: "/admin/news", icon: Newspaper, label: "资讯管理" },
  { href: "/admin/sections", icon: Layers, label: "版块管理" },
  { href: "/admin/media", icon: Image, label: "媒体库" },
  { href: "/admin/navigation", icon: Navigation, label: "导航管理" },
  { href: "/admin/settings", icon: Settings, label: "站点设置" },
  { href: "/admin/accounts", icon: UserCog, label: "账号管理" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-[#141820] border-r border-gray-700/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B5E1A] flex items-center justify-center">
            <span className="text-white font-bold text-sm">帝</span>
          </div>
          <div>
            <div className="text-[#E8C96A] font-bold text-sm leading-none">帝国纪元</div>
            <div className="text-gray-500 text-xs leading-none mt-0.5">Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#C9A84C]/15 text-[#E8C96A] border border-[#C9A84C]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} className={active ? "text-[#C9A84C]" : "text-gray-500 group-hover:text-gray-300"} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-[#C9A84C]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-700/50">
        <p className="text-gray-600 text-xs text-center">v1.0.0</p>
      </div>
    </aside>
  );
}
