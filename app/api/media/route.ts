import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "game-website",
            },
            (error, result) => {
              if (error || !result) {
                const msg = error
                  ? (error.message ?? JSON.stringify(error))
                  : "No result from Cloudinary";
                return reject(new Error(msg));
              }
              resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(buffer);
      }
    );

    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: file.name,
        url: result.secure_url,
        size: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : typeof err === "object"
        ? JSON.stringify(err)
        : String(err);
    console.error("[media upload error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
