import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const sections = await prisma.pageSection.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(sections);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const last = await prisma.pageSection.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = (last?.order ?? -1) + 1;

    const section = await prisma.pageSection.create({
      data: {
        key: body.key,
        titleZh: body.titleZh ?? "",
        titleEn: body.titleEn ?? "",
        isVisible: body.isVisible ?? true,
        isLocked: false,
        order: nextOrder,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
