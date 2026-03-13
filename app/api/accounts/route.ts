import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const accounts = await prisma.adminUser.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const hashedPassword = await bcrypt.hash(body.password, 12);

  const account = await prisma.adminUser.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || "editor",
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(
    { id: account.id, name: account.name, email: account.email, role: account.role },
    { status: 201 }
  );
}
