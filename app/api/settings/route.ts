import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body: Record<string, string> = await req.json();

  const updates = Object.entries(body).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );

  await Promise.all(updates);

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(settings);
}
