import { decimal, pgTable, text } from "drizzle-orm/pg-core";
import { baseFields } from "./base";

// Departments table
export const departments = pgTable("departments", {
	...baseFields,
	name: text("name").notNull(),
	description: text("description"),
	budget: decimal("budget", { precision: 12, scale: 2 }),
	managerId: text("manager_id"),
});

// Export types
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;