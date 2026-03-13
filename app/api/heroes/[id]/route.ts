import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const hero = await prisma.hero.findUnique({ where: { id } });
  if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(hero);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const hero = await prisma.hero.update({
    where: { id },
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
      isVisible: body.isVisible,
      order: body.order,
    },
  });

  revalidatePath("/zh");
  revalidatePath("/en");
  return NextResponse.json(hero);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.hero.delete({ where: { id } });
  revalidatePath("/zh");
  revalidatePath("/en");
  return NextResponse.json({ success: true });
}
