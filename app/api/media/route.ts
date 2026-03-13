import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const files = await prisma.mediaFile.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const filename = `${timestamp}-${file.name.replace(/\s/g, "-")}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

  // Ensure uploads directory exists
  const { mkdir } = await import("fs/promises");
  await mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });

  await writeFile(uploadPath, buffer);

  const mediaFile = await prisma.mediaFile.create({
    data: {
      filename: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      mimeType: file.type,
    },
  });

  return NextResponse.json(mediaFile, { status: 201 });
}
