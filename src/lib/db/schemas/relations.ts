import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { projects } from "./projects";
import { roles } from "./roles";
import { user } from "./auth";

// Relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
	manager: one(user, {
		fields: [departments.managerId],
		references: [user.id],
	}),
	users: many(user),
	projects: many(projects),
	roles: many(roles),
}));

export const userRelations = relations(user, ({ one, many }) => ({
	department: one(departments, {
		fields: [user.departmentId],
		references: [departments.id],
	}),
	role: one(roles, {
		fields: [user.roleId],
		references: [roles.id],
	}),
	managedDepartments: many(departments),
	managedProjects: many(projects),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
	department: one(departments, {
		fields: [roles.departmentId],
		references: [departments.id],
	}),
	users: many(user),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
	department: one(departments, {
		fields: [projects.departmentId],
		references: [departments.id],
	}),
	manager: one(user, {
		fields: [projects.managerId],
		references: [user.id],
	}),
}));