import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const body: { key: string; order: number }[] = await req.json();

  await Promise.all(
    body.map(({ key, order }) =>
      prisma.pageSection.update({ where: { key }, data: { order } })
    )
  );

  return NextResponse.json({ success: true });
}
