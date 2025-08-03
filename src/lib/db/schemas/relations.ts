import { relations } from "drizzle-orm";
import { departments } from "./departments";
import { projects } from "./projects";
import { roles } from "./roles";
import { users } from "./users";

// Relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
	manager: one(users, {
		fields: [departments.managerId],
		references: [users.id],
	}),
	users: many(users),
	projects: many(projects),
	roles: many(roles),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
	department: one(departments, {
		fields: [users.departmentId],
		references: [departments.id],
	}),
	role: one(roles, {
		fields: [users.roleId],
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
	users: many(users),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
	department: one(departments, {
		fields: [projects.departmentId],
		references: [departments.id],
	}),
	manager: one(users, {
		fields: [projects.managerId],
		references: [users.id],
	}),
}));