import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";

function isValidHref(href: string): boolean {
  if (href.startsWith("/")) return true; // Relative path
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const items = await prisma.navItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.labelZh || !body.href) {
      return NextResponse.json({ error: "labelZh and href are required" }, { status: 400 });
    }

    if (!isValidHref(body.href)) {
      return NextResponse.json({ error: "Invalid href: must be a relative path or http/https URL" }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (body.href !== undefined && !isValidHref(body.href)) {
      return NextResponse.json({ error: "Invalid href: must be a relative path or http/https URL" }, { status: 400 });
    }

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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.navItem.delete({ where: { id: body.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
