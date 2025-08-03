import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}

// Create the connection
const sql = neon(process.env.DATABASE_URL!);

// Create the database instance
export const db = drizzle(sql, { schema });

export * from "./schemas";
