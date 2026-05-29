import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.stockAsset.deleteMany();

  await prisma.transaction.createMany({
    data: [
      { type: "INCOME",  amount: 5500,  category: "Salary",        description: "Monthly salary",       date: new Date("2026-05-01") },
      { type: "INCOME",  amount: 800,   category: "Other",         description: "Freelance project",    date: new Date("2026-05-10") },
      { type: "EXPENSE", amount: 1400,  category: "Rent",          description: "May rent",              date: new Date("2026-05-01") },
      { type: "EXPENSE", amount: 320,   category: "Food",          description: "Groceries & dining",   date: new Date("2026-05-05") },
      { type: "EXPENSE", amount: 45,    category: "Subscriptions", description: "Streaming services",   date: new Date("2026-05-03") },
      { type: "EXPENSE", amount: 120,   category: "Utilities",     description: "Electric & internet",  date: new Date("2026-05-07") },
      { type: "EXPENSE", amount: 80,    category: "Entertainment", description: "Movies & games",       date: new Date("2026-05-14") },
      { type: "INCOME",  amount: 5500,  category: "Salary",        description: "Monthly salary",       date: new Date("2026-04-01") },
      { type: "EXPENSE", amount: 1400,  category: "Rent",          description: "April rent",            date: new Date("2026-04-01") },
      { type: "EXPENSE", amount: 290,   category: "Food",          description: "Groceries",             date: new Date("2026-04-08") },
    ],
  });

  await prisma.stockAsset.createMany({
    data: [
      { ticker: "AAPL",  shares: 10, lastPrice: 213.32 },
      { ticker: "MSFT",  shares: 5,  lastPrice: 455.10 },
      { ticker: "GOOGL", shares: 3,  lastPrice: 172.50 },
      { ticker: "NVDA",  shares: 8,  lastPrice: 135.75 },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
