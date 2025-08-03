import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const statusEnum = pgEnum("status", ["Active", "Inactive", "Pending"]);
export const projectStatusEnum = pgEnum("project_status", [
	"Planning",
	"In Progress",
	"Completed",
	"On Hold",
	"Cancelled",
]);
export const priorityEnum = pgEnum("priority", [
	"Low",
	"Medium",
	"High",
	"Critical",
]);