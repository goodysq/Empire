import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.navItem.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const item = await prisma.navItem.create({
    data: {
      labelZh: body.labelZh,
      labelEn: body.labelEn,
      href: body.href,
      order: body.order ?? 0,
      isVisible: body.isVisible ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const item = await prisma.navItem.update({
    where: { id: body.id },
    data: {
      labelZh: body.labelZh,
      labelEn: body.labelEn,
      href: body.href,
      order: body.order,
      isVisible: body.isVisible,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  await prisma.navItem.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
