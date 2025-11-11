import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

function getPostgresDatabaseName(connStr: string): string | null {
  connStr = (connStr ?? "").trim();
  if (!connStr) return null;

  try {
    const maybe = connStr.startsWith("postgres://") || connStr.startsWith("postgresql://");
    if (maybe) {
      const url = new URL(connStr);
      const path = url.pathname ?? "";
      if (path.length > 1) {
        return decodeURIComponent(path.slice(1));
      }
      const dbFromQuery = url.searchParams.get("dbname") || url.searchParams.get("database");
      if (dbFromQuery) return dbFromQuery;
    }
  } catch (e) {}

  const kvMatch = connStr.match(/(?:^|\s)(?:dbname|database)\s*=\s*('([^']*)'|"([^"]*)"|([^\s]+))/i);
  if (kvMatch) {
    const db = kvMatch[2] ?? kvMatch[3] ?? kvMatch[4];
    return db ?? null;
  }

  try {
    const forced = "postgresql://" + connStr;
    const url2 = new URL(forced);
    const path = url2.pathname ?? "";
    if (path.length > 1) return decodeURIComponent(path.slice(1));
  } catch (e) {}

  return null;
}

async function ensureDatabaseExists(baseUrl: string, dbName: string) {
  // change database to "postgres"
  const adminUrl = new URL(baseUrl);
  adminUrl.pathname = "/postgres"; // change database
  const adminPool = new Pool({ connectionString: adminUrl.toString(), max: 1 });

  try {
    const client = await adminPool.connect();
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (result.rowCount === 0) {
      console.log(`Database "${dbName}" not found. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
    client.release();
  } finally {
    await adminPool.end();
  }
}

async function runMigration() {
  console.log("Migration started");

  const dbUrl = process.env.DATABASE_URL as string;
  const createDatabase = process.env.CREATE_DATABASE === "true";

  if (!dbUrl) throw new Error("No database URL found");

  const dbName = process.env.DATABASE_NAME ?? getPostgresDatabaseName(dbUrl);
  if (!dbName) throw new Error("No database name found");

  // create database if needed
  if (createDatabase) {
    await ensureDatabaseExists(dbUrl, dbName);
  }

  // connect to database and run migrations
  const pool = new Pool({ connectionString: dbUrl, max: 1 });
  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigration().catch((error) => console.error("Error in migration process:", error));