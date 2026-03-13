import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  const heroes = await prisma.hero.findMany({
    where: all ? undefined : { isVisible: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(heroes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const hero = await prisma.hero.create({
    data: {
      nameZh: body.nameZh,
      nameEn: body.nameEn,
      titleZh: body.titleZh,
      titleEn: body.titleEn,
      descZh: body.descZh,
      descEn: body.descEn,
      imageUrl: body.imageUrl,
      faction: body.faction,
      rarity: body.rarity,
      isVisible: body.isVisible ?? true,
      order: body.order ?? 0,
    },
  });

  revalidatePath("/zh");
  revalidatePath("/en");
  return NextResponse.json(hero, { status: 201 });
}
