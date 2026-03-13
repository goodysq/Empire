import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const sections = await prisma.pageSection.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Get the max order value to append at the end
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
}
