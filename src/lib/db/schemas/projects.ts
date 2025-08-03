import { boolean, decimal, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { priorityEnum, projectStatusEnum } from "./enums";

// Projects table
export const projects = pgTable("projects", {
	...baseFields,
	name: text("name").notNull(),
	description: text("description"),
	status: projectStatusEnum("status").default("Planning").notNull(),
	priority: priorityEnum("priority").default("Medium").notNull(),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date"),
	budget: decimal("budget", { precision: 12, scale: 2 }),
	departmentId: uuid("department_id"),
	managerId: uuid("manager_id"),
	progress: integer("progress").default(0),
	isActive: boolean("is_active").default(true),
});

// Export types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;