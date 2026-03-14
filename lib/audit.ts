import { prisma } from "./db";
import type { Session } from "next-auth";

type SessionUser = { id?: string; role?: string; email?: string | null };

export async function logAudit(
  session: Session,
  action: string,
  resource: string,
  resourceId?: string,
  details?: string
): Promise<void> {
  try {
    const user = session.user as SessionUser;
    await prisma.auditLog.create({
      data: {
        userId: user.id ?? "unknown",
        userEmail: user.email ?? "unknown",
        action,
        resource,
        resourceId,
        details,
      },
    });
  } catch {
    // Audit logging must never fail the main request
    console.error("[audit] Failed to write audit log:", { action, resource, resourceId });
  }
}
