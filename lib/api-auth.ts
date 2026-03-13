import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type SessionUser = { id?: string; role?: string };

type AuthResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

export function getSessionUser(session: Session): SessionUser {
  return session.user as SessionUser;
}

export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (result.error) return result;
  const user = getSessionUser(result.session!);
  if (user.role !== "admin") {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
