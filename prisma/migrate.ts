import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? process.env.db_v3_TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN ?? process.env.db_v3_TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ TURSO_DATABASE_URL is not set");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS "Transaction" (
      "id"          TEXT     NOT NULL PRIMARY KEY,
      "type"        TEXT     NOT NULL,
      "amount"      REAL     NOT NULL,
      "category"    TEXT     NOT NULL,
      "description" TEXT,
      "date"        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "StockAsset" (
      "id"        TEXT     NOT NULL PRIMARY KEY,
      "ticker"    TEXT     NOT NULL UNIQUE,
      "shares"    REAL     NOT NULL,
      "lastPrice" REAL     NOT NULL DEFAULT 0.0,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tables created successfully");
  client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
