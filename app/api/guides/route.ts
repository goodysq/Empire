import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { sanitize } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    // Require auth to view hidden guides
    if (all) {
      const session = await auth();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guides = await prisma.guide.findMany({
      where: all ? {} : { isVisible: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(guides);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.titleZh) {
      return NextResponse.json({ error: "titleZh is required" }, { status: 400 });
    }

    const last = await prisma.guide.findFirst({ orderBy: { order: "desc" } });
    const nextOrder = (last?.order ?? -1) + 1;

    const guide = await prisma.guide.create({
      data: {
        titleZh: body.titleZh,
        titleEn: body.titleEn ?? "",
        excerptZh: body.excerptZh ?? "",
        excerptEn: body.excerptEn ?? "",
        contentZh: sanitize(body.contentZh),
        contentEn: sanitize(body.contentEn),
        coverImage: body.coverImage ?? "",
        category: body.category ?? "",
        isVisible: body.isVisible ?? true,
        order: nextOrder,
      },
    });

    return NextResponse.json(guide, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
