import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const file = await prisma.mediaFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete physical file
  try {
    const filePath = path.join(process.cwd(), "public", file.url);
    await unlink(filePath);
  } catch {
    // File may not exist, continue
  }

  await prisma.mediaFile.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
