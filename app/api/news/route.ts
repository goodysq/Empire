import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin");
  const limit = searchParams.get("limit");

  const news = await prisma.news.findMany({
    where: admin ? undefined : { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

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
}
