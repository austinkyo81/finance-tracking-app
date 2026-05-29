import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  // Vercel's Turso integration prefixes vars with "db_v3_"; fall back to unprefixed for local dev
  const url =
    process.env.db_v3_TURSO_DATABASE_URL ??
    process.env.TURSO_DATABASE_URL ??
    "file:./dev.db";

  const authToken =
    process.env.db_v3_TURSO_AUTH_TOKEN ??
    process.env.TURSO_AUTH_TOKEN;

  if (url === "file:./dev.db") {
    console.warn("[prisma] No TURSO_DATABASE_URL found — falling back to local file:./dev.db");
  }

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
