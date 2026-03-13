import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const body = await req.json();

  const section = await prisma.pageSection.upsert({
    where: { key },
    update: {
      titleZh: body.titleZh,
      titleEn: body.titleEn,
      subtitleZh: body.subtitleZh,
      subtitleEn: body.subtitleEn,
      contentZh: body.contentZh,
      contentEn: body.contentEn,
      imageUrl: body.imageUrl,
      isVisible: body.isVisible ?? true,
      isLocked: body.isLocked ?? false,
      showInNav: body.showInNav ?? false,
      ...(body.order !== undefined ? { order: body.order } : {}),
    },
    create: {
      key,
      titleZh: body.titleZh,
      titleEn: body.titleEn,
      subtitleZh: body.subtitleZh,
      subtitleEn: body.subtitleEn,
      contentZh: body.contentZh,
      contentEn: body.contentEn,
      imageUrl: body.imageUrl,
      isVisible: body.isVisible ?? true,
      isLocked: body.isLocked ?? false,
      showInNav: body.showInNav ?? false,
      order: body.order ?? 0,
    },
  });

  return NextResponse.json(section);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  // Check if section is locked
  const section = await prisma.pageSection.findUnique({ where: { key } });
  if (!section) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (section.isLocked) {
    return NextResponse.json({ error: "Section is locked" }, { status: 403 });
  }

  await prisma.pageSection.delete({ where: { key } });
  return NextResponse.json({ success: true });
}
