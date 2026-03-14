"use client";

import { useRef, useEffect, useState } from "react";
import { loc } from "@/lib/loc";

interface ReservationSectionProps {
  locale: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ReservationSection({ locale }: ReservationSectionProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "duplicate" | "rate_limited" | "invalid" | "error"
  >("idle");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus("invalid"); // client-side format error
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 201) {
        setStatus("success");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else if (res.status === 429) {
        setStatus("rate_limited");
      } else if (res.status === 400) {
        setStatus("invalid"); // server-side format rejection
      } else {
        setStatus("error"); // 500 or unexpected
      }
    } catch {
      setStatus("error");
    }
  };

  const title = loc(locale, "预约公测", "預約公測", "Pre-Register");
  const subtitle = loc(
    locale,
    "留下你的邮箱，公测开始第一时间通知你",
    "留下你的郵箱，公測開始第一時間通知你",
    "Leave your email and be the first to know when beta launches"
  );
  const placeholder = loc(locale, "输入你的邮箱", "輸入你的郵箱", "Enter your email");
  const btnText = loc(locale, "立即预约", "立即預約", "Pre-Register Now");

  const feedback: Record<string, { text: string; color: string }> = {
    success: {
      text: loc(locale, "预约成功！我们会在公测开始时通知您", "預約成功！我們會在公測開始時通知您", "Reserved! We'll notify you when beta launches."),
      color: "text-green-400",
    },
    duplicate: {
      text: loc(locale, "该邮箱已预约", "該郵箱已預約", "This email is already registered."),
      color: "text-[#C9A84C]",
    },
    rate_limited: {
      text: loc(locale, "提交过于频繁，请稍后再试", "提交過於頻繁，請稍後再試", "Too many attempts, please try again later."),
      color: "text-red-400",
    },
    invalid: {
      text: loc(locale, "请输入有效的邮箱地址", "請輸入有效的郵箱地址", "Please enter a valid email address."),
      color: "text-red-400",
    },
    error: {
      text: loc(locale, "提交失败，请稍后重试", "提交失敗，請稍後重試", "Submission failed, please try again later."),
      color: "text-red-400",
    },
  };

  const privacyNote = loc(
    locale,
    "提交即表示您同意我们收集您的邮箱用于公测通知",
    "提交即表示您同意我們收集您的郵箱用於公測通知",
    "By submitting, you agree to us collecting your email for beta test notifications."
  );

  return (
    <section
      ref={sectionRef}
      id="reservation"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0D0F18]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0806] via-[#0D0F18] to-[#0A0806]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/3 blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Decorator */}
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="w-2 h-2 bg-[#C9A84C] rotate-45" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>

          <h2
            className="text-4xl sm:text-5xl font-black mb-4"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <span className="bg-gradient-to-b from-[#F5EDD5] via-[#E8C96A] to-[#C9A84C] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <p className="text-[#B8A882] text-lg mb-10">{subtitle}</p>
        </div>

        {/* Form or success state */}
        <div
          className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {status === "success" ? (
            <div className="py-6">
              <div className="text-4xl mb-4">✦</div>
              <p className="text-green-400 text-lg font-medium">{feedback.success.text}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder={placeholder}
                maxLength={254}
                disabled={status === "loading"}
                className="flex-1 max-w-sm px-5 py-3.5 bg-[#1A1D26] border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#E8C96A] text-[#0A0806] font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-[#C9A84C]/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {loc(locale, "提交中...", "提交中...", "Submitting...")}
                  </span>
                ) : (
                  btnText
                )}
              </button>
            </form>
          )}

          {/* Feedback message */}
          {status !== "idle" && status !== "loading" && status !== "success" && (
            <p className={`mt-3 text-sm ${feedback[status]?.color ?? "text-red-400"}`}>
              {feedback[status]?.text}
            </p>
          )}

          {/* Privacy note */}
          {status !== "success" && (
            <p className="mt-5 text-[#B8A882]/40 text-xs">{privacyNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}
