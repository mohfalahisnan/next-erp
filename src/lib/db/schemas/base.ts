import { timestamp, uuid } from "drizzle-orm/pg-core";

// Base fields for all tables
export const baseFields = {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
};