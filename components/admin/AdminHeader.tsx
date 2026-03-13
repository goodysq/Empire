"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#141820] border-b border-gray-700/50 flex items-center justify-between px-6">
      <div>
        <h1 className="text-white font-semibold text-sm">帝国纪元 CMS</h1>
        <p className="text-gray-500 text-xs">Content Management System</p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ExternalLink size={14} />
          <span>查看网站</span>
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center">
              <User size={14} className="text-[#C9A84C]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white text-sm font-medium">{user?.name || "Admin"}</div>
              <div className="text-gray-500 text-xs">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10"
          >
            <LogOut size={14} />
            <span className="hidden sm:block">退出</span>
          </button>
        </div>
      </div>
    </header>
  );
}
