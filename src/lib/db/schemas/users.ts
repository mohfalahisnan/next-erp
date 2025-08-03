import { decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { baseFields } from "./base";
import { statusEnum } from "./enums";

// Users table
export const users = pgTable("users", {
	...baseFields,
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	roleId: uuid("role_id").notNull(),
	status: statusEnum("status").default("Active").notNull(),
	departmentId: uuid("department_id"),
	position: text("position").notNull(),
	salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
	hireDate: timestamp("hire_date").notNull(),
	phone: text("phone"),
	address: text("address"),
	lastLogin: timestamp("last_login"),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;