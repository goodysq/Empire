"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label: string;
  variant?: "text" | "outlined";
  /** When provided, navigates to this URL. Otherwise uses router.back(). */
  href?: string;
}

export function BackButton({ label, variant = "text", href }: BackButtonProps) {
  const router = useRouter();
  const handleClick = () => (href ? router.push(href) : router.back());

  if (variant === "outlined") {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#C9A84C]/40 text-[#C9A84C] rounded text-sm font-medium hover:border-[#E8C96A] hover:text-[#E8C96A] transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#E8C96A] text-sm mb-8 transition-colors group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
      {label}
    </button>
  );
}
