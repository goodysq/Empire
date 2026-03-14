import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { sanitize } from "@/lib/sanitize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guide = await prisma.guide.findUnique({ where: { id } });
    if (!guide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(guide);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    const guide = await prisma.guide.update({
      where: { id },
      data: {
        titleZh: body.titleZh,
        titleEn: body.titleEn,
        excerptZh: body.excerptZh,
        excerptEn: body.excerptEn,
        contentZh: body.contentZh !== undefined ? sanitize(body.contentZh) : undefined,
        contentEn: body.contentEn !== undefined ? sanitize(body.contentEn) : undefined,
        coverImage: body.coverImage,
        category: body.category,
        isVisible: body.isVisible ?? true,
        ...(body.order !== undefined ? { order: body.order } : {}),
      },
    });

    return NextResponse.json(guide);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.guide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
