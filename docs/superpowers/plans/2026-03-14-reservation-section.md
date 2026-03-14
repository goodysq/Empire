# Reservation Section Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pre-registration section to the landing page that collects player emails for beta notification, with an admin management panel.

**Architecture:** Public `POST /api/reservations` (rate-limited by IP) stores normalized emails in a new `Reservation` DB table. The `ReservationSection` client component is hardcoded into the landing page between news and download. Admin panel at `/admin/(protected)/reservations` shows a paginated list with CSV export.

**Tech Stack:** Next.js 16.1.6, Prisma + PostgreSQL (Neon), NextAuth v5, Tailwind CSS, TypeScript

---

## Chunk 1: Database & API

### Task 1: Add Reservation model to Prisma schema and push to DB

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Reservation model**

Open `prisma/schema.prisma` and append after the `Guide` model:

```prisma
model Reservation {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(254)
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

- [ ] **Step 2: Push schema to database**

```bash
cd C:/Users/yangshiqi/Empire
npx prisma db push
```

Expected output: `Your database is now in sync with your Prisma schema.`

- [ ] **Step 3: Verify generated client**

```bash
npx prisma generate
```

Expected: `Generated Prisma Client` success message.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Reservation model to schema"
```

---

### Task 2: POST /api/reservations — submit email

**Files:**
- Create: `app/api/reservations/route.ts`

- [ ] **Step 1: Create the file**

Create `app/api/reservations/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

// In-memory rate limiter: max 5 submissions per 10 minutes per IP
const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) return false;
  return record.count >= 5;
}

function recordAttempt(ip: string): void {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
  } else {
    record.count++;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  // Record attempt before body parsing — intentional: prevents request flooding
  // regardless of payload validity. Acceptable for single-instance intranet deploy.
  recordAttempt(ip);

  try {
    const body = await req.json();
    const raw = typeof body.email === "string" ? body.email : "";
    const email = raw.toLowerCase().trim();

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    await prisma.reservation.create({ data: { email } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    // Prisma unique constraint violation code
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "already_reserved" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.reservation.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.reservation.count(),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/reservations/route.ts
git commit -m "feat: add POST/GET /api/reservations"
```

---

### Task 3: GET /api/reservations/export — CSV download

**Files:**
- Create: `app/api/reservations/export/route.ts`

- [ ] **Step 1: Create the file**

Create `app/api/reservations/export/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "asc" },
      select: { email: true, createdAt: true },
    });

    // UTF-8 BOM for Excel CJK compatibility
    const BOM = "\uFEFF";
    const header = "email,created_at\r\n";
    const rows = reservations
      .map((r) => `${r.email},${r.createdAt.toISOString()}`)
      .join("\r\n");
    const csv = BOM + header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reservations.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/reservations/export/route.ts
git commit -m "feat: add CSV export for reservations"
```

---

## Chunk 2: Frontend Component

### Task 4: ReservationSection component

**Files:**
- Create: `components/website/ReservationSection.tsx`

- [ ] **Step 1: Create the component**

Create `components/website/ReservationSection.tsx`:

```typescript
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
```

- [ ] **Step 2: Verify loc import path is correct**

Check that `@/lib/loc` exports `loc`. Run:
```bash
grep -n "export" C:/Users/yangshiqi/Empire/lib/loc.ts
```
Expected: a named export of `loc`.

- [ ] **Step 3: Commit**

```bash
git add components/website/ReservationSection.tsx
git commit -m "feat: add ReservationSection component"
```

---

### Task 5: Insert ReservationSection into landing page

**Files:**
- Modify: `app/[locale]/page.tsx`

**Why this approach:** The page renders sections via `allSections.map()` (DB-driven order). We must NOT couple `ReservationSection` to the DB section system. Instead, we split the `renderedSections` array at the "news" index and inject `<ReservationSection>` between the two halves directly in the JSX.

- [ ] **Step 1: Add import**

In `app/[locale]/page.tsx`, add after the `GuidesSection` import line:

```typescript
import ReservationSection from "@/components/website/ReservationSection";
```

- [ ] **Step 2: Split renderedSections and inject ReservationSection**

After the `renderedSections` const definition (after the `.map()` call), add:

```typescript
  // Insert ReservationSection after the "news" section (hardcoded, not DB-driven)
  const newsIdx = allSections.findIndex((s: PageSection) => s.key === "news");
  const insertAt = newsIdx >= 0 ? newsIdx + 1 : renderedSections.length;
  const sectionsBeforeReservation = renderedSections.slice(0, insertAt);
  const sectionsAfterReservation = renderedSections.slice(insertAt);
```

- [ ] **Step 3: Update the JSX return**

Replace `{renderedSections}` in the `<main>` return with the split arrays:

```tsx
  return (
    <main className="bg-[#0A0806] min-h-screen">
      <Navbar
        locale={locale}
        logoUrl={logoUrl}
        gameNameZh={gameNameZh}
        gameNameEn={gameNameEn}
        navItems={navItems}
        customNavSections={customNavSections.map((s: PageSection) => ({
          key: s.key,
          labelZh: s.titleZh || s.key,
          labelEn: s.titleEn || s.key,
        }))}
      />
      {sectionsBeforeReservation}
      <ReservationSection locale={locale} />
      {sectionsAfterReservation}
      <Footer
        locale={locale}
        iosLink={iosLink}
        androidLink={androidLink}
        socialLinks={socialLinks}
        logoUrl={logoUrl}
        gameNameZh={gameNameZh}
        gameNameEn={gameNameEn}
      />
    </main>
  );
```

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/page.tsx"
git commit -m "feat: insert ReservationSection after NewsSection on landing page"
```

---

## Chunk 3: Admin Panel

### Task 6: Admin reservations page

**Files:**
- Create: `app/admin/(protected)/reservations/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/admin/(protected)/reservations/page.tsx`:

```typescript
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
                  className="border-b border-gray-700/30 hover:bg-white/3 transition-colors"
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/admin/(protected)/reservations/page.tsx"
git commit -m "feat: add admin reservations management page"
```

---

### Task 7: Add reservations to AdminSidebar

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Add Mail icon import**

In `components/admin/AdminSidebar.tsx`, add `Mail` to the lucide-react import:

```typescript
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
  BookOpen,
  Mail,
} from "lucide-react";
```

- [ ] **Step 2: Add reservation nav item**

In the `navItems` array, add after the guides entry:

```typescript
  { href: "/admin/reservations", icon: Mail, label: "预约管理" },
```

The full array should look like:
```typescript
const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/heroes", icon: Users, label: "英雄管理" },
  { href: "/admin/news", icon: Newspaper, label: "资讯管理" },
  { href: "/admin/guides", icon: BookOpen, label: "攻略管理" },
  { href: "/admin/reservations", icon: Mail, label: "预约管理" },
  { href: "/admin/sections", icon: Layers, label: "版块管理" },
  { href: "/admin/media", icon: Image, label: "媒体库" },
  { href: "/admin/navigation", icon: Navigation, label: "导航管理" },
  { href: "/admin/settings", icon: Settings, label: "站点设置" },
  { href: "/admin/accounts", icon: UserCog, label: "账号管理" },
];
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminSidebar.tsx
git commit -m "feat: add reservation management to admin sidebar"
```

---

## Chunk 4: Build & Deploy

### Task 8: Build and redeploy

- [ ] **Step 1: Build**

```bash
cd C:/Users/yangshiqi/Empire
npm run build
```

Expected: no errors, all routes listed including `/api/reservations`.

- [ ] **Step 2: Restart PM2**

```bash
pm2 restart empire
```

- [ ] **Step 3: Smoke test**

1. Open http://192.168.1.39:3000 → scroll to find the reservation section between news and download
2. Submit a test email → should show success message
3. Submit same email again → should show "该邮箱已预约"
4. Open http://192.168.1.39:3000/admin/reservations → should show the submitted email with timestamp
5. Click "导出 CSV" → should download a CSV with the email

- [ ] **Step 4: Push to GitHub**

```bash
git push
```
