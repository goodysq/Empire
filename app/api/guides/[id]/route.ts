import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const guide = await prisma.guide.update({
    where: { id },
    data: {
      titleZh: body.titleZh,
      titleEn: body.titleEn,
      excerptZh: body.excerptZh,
      excerptEn: body.excerptEn,
      coverImage: body.coverImage,
      category: body.category,
      isVisible: body.isVisible ?? true,
      ...(body.order !== undefined ? { order: body.order } : {}),
    },
  });

  return NextResponse.json(guide);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.guide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
