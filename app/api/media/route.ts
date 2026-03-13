import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";

export async function GET() {
  const files = await prisma.mediaFile.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s/g, "-")}`;

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: file.name,
        url: blob.url,
        size: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[media upload error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
