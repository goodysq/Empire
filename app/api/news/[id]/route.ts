import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import { sanitize } from "@/lib/sanitize";
import { logAudit } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    const news = await prisma.news.update({
      where: { id },
      data: {
        titleZh: body.titleZh,
        titleEn: body.titleEn,
        excerptZh: body.excerptZh,
        excerptEn: body.excerptEn,
        contentZh: body.contentZh !== undefined ? sanitize(body.contentZh) : undefined,
        contentEn: body.contentEn !== undefined ? sanitize(body.contentEn) : undefined,
        coverImage: body.coverImage,
        isPublished: body.isPublished,
        publishedAt: body.publishedAt
          ? new Date(body.publishedAt)
          : body.isPublished === false
          ? null
          : undefined,
      },
    });

    await logAudit(session!, "update", "news", id, news.titleZh);
    revalidatePath("/zh");
    revalidatePath("/en");
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    await logAudit(session!, "delete", "news", id);
    await prisma.news.delete({ where: { id } });
    revalidatePath("/zh");
    revalidatePath("/en");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
