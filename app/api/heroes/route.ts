import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    // Require auth to view hidden heroes
    if (all) {
      const session = await auth();
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const heroes = await prisma.hero.findMany({
      where: all ? undefined : { isVisible: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(heroes);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.nameZh) {
      return NextResponse.json({ error: "nameZh is required" }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
