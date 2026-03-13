import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const body: { id: string; order: number }[] = await req.json();

  await Promise.all(
    body.map(({ id, order }) =>
      prisma.guide.update({ where: { id }, data: { order } })
    )
  );

  return NextResponse.json({ success: true });
}
