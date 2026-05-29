import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
  if (!process.env.TURSO_DATABASE_URL) {
    console.warn("[prisma] TURSO_DATABASE_URL not set — falling back to local file:./dev.db");
  }
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
