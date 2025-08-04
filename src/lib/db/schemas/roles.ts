import { pgTable, text } from "drizzle-orm/pg-core";
import { baseFields } from "./base";

// Roles table
export const roles = pgTable("roles", {
	...baseFields,
	name: text("name").notNull(),
	description: text("description"),
	permissions: text("permissions").array(),
	departmentId: text("department_id"),
});

// Export types
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;