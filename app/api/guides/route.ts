import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  const guides = await prisma.guide.findMany({
    where: all ? {} : { isVisible: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(guides);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const last = await prisma.guide.findFirst({ orderBy: { order: "desc" } });
  const nextOrder = (last?.order ?? -1) + 1;

  const guide = await prisma.guide.create({
    data: {
      titleZh: body.titleZh,
      titleEn: body.titleEn ?? "",
      excerptZh: body.excerptZh ?? "",
      excerptEn: body.excerptEn ?? "",
      coverImage: body.coverImage ?? "",
      category: body.category ?? "",
      isVisible: body.isVisible ?? true,
      order: nextOrder,
    },
  });

  return NextResponse.json(guide, { status: 201 });
}
