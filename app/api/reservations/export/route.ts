import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "asc" },
      select: { email: true, createdAt: true },
    });

    // UTF-8 BOM for Excel CJK compatibility
    const BOM = "\uFEFF";
    const header = "email,created_at\r\n";
    const rows = reservations
      .map((r) => `${r.email},${r.createdAt.toISOString()}`)
      .join("\r\n");
    const csv = BOM + header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reservations.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
