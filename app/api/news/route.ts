import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam) || 10, 1), 100) : undefined;

    // Require auth to view unpublished news
    if (admin) {
      const session = await auth();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await prisma.news.findMany({
      where: admin ? undefined : { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(news);
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

    const news = await prisma.news.create({
      data: {
        titleZh: body.titleZh,
        titleEn: body.titleEn,
        excerptZh: body.excerptZh,
        excerptEn: body.excerptEn,
        contentZh: body.contentZh || "",
        contentEn: body.contentEn,
        coverImage: body.coverImage,
        isPublished: body.isPublished ?? false,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
    });

    revalidatePath("/zh");
    revalidatePath("/en");
    return NextResponse.json(news, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
