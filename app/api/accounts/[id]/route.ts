import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, getSessionUser } from "@/lib/api-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();

    // Only admins can change roles or edit other users' accounts
    const user = getSessionUser(session!);
    const isSelf = user.id === id;
    const isAdmin = user.role === "admin";

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only admins can change roles
    if (body.role !== undefined && !isAdmin) {
      return NextResponse.json({ error: "Forbidden: only admins can change roles" }, { status: 403 });
    }

    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      isActive?: boolean;
      password?: string;
    } = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.role !== undefined && isAdmin) updateData.role = body.role;
    if (body.isActive !== undefined && isAdmin) updateData.isActive = body.isActive;
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12);
    }

    const account = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    // Prevent self-deletion
    if (getSessionUser(session!).id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
