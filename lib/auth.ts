import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { authConfig } from "./auth.config";

// In-memory rate limiter: max 5 failed attempts per 15 minutes per email
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(email);
  if (!record || now > record.resetAt) return false;
  return record.count >= 5;
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const record = loginAttempts.get(email);
  if (!record || now > record.resetAt) {
    loginAttempts.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    record.count++;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        // First login: store user data and updatedAt timestamp
        token.role = (user as { role?: string }).role;
        token.id = user.id;
        token.userUpdatedAt = (user as { updatedAt?: number }).updatedAt;
      } else if (token.id) {
        // Subsequent requests: verify user is still active and password hasn't changed
        const dbUser = await prisma.adminUser.findUnique({
          where: { id: token.id as string },
          select: { isActive: true, updatedAt: true, role: true },
        });
        if (!dbUser || !dbUser.isActive) return null;
        if (token.userUpdatedAt && dbUser.updatedAt.getTime() > (token.userUpdatedAt as number)) {
          return null; // Password or account changed — invalidate session
        }
        token.role = dbUser.role; // Sync role changes
      }
      return token;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;

        if (isRateLimited(email)) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          recordFailedAttempt(email);
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          recordFailedAttempt(email);
          return null;
        }

        loginAttempts.delete(email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          updatedAt: user.updatedAt.getTime(),
        };
      },
    }),
  ],
});
