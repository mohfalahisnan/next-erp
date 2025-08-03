import { z } from 'zod';

// Base schema with common fields
export const baseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User schemas
export const userSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  status: z.enum(['Active', 'Inactive', 'Pending']),
  departmentId: z.string().uuid().nullable(),
  position: z.string().nullable(),
  salary: z.number().nullable(),
  hireDate: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  lastLogin: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  roleId: z.string().uuid(),
  status: z.enum(['Active', 'Inactive', 'Pending']).default('Active'),
  departmentId: z.string().uuid().optional(),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().min(0, 'Salary must be a positive number'),
  hireDate: z.coerce.date(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const userUpdateSchema = userCreateSchema.partial().extend({
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

// Department schemas
export const departmentSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  budget: z.number().nullable(),
  managerId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const departmentCreateSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  budget: z.number().optional(),
  managerId: z.string().uuid().optional(),
});

export const departmentUpdateSchema = departmentCreateSchema.partial();

// Role schemas
export const roleSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(z.string()).nullable(),
  departmentId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const roleCreateSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  departmentId: z.string().uuid().optional(),
});

export const roleUpdateSchema = roleCreateSchema.partial();

// Project schemas
export const projectSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  startDate: z.string(),
  endDate: z.string().nullable(),
  budget: z.number().nullable(),
  departmentId: z.string().uuid().nullable(),
  managerId: z.string().uuid().nullable(),
  progress: z.number().min(0).max(100),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectCreateSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled']).default('Planning'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  startDate: z.string(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  departmentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  progress: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
});

export const projectUpdateSchema = projectCreateSchema.partial();

// Export types
export type UserSelect = z.infer<typeof userSelectSchema>;
export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type DepartmentSelect = z.infer<typeof departmentSelectSchema>;
export type DepartmentCreate = z.infer<typeof departmentCreateSchema>;
export type DepartmentUpdate = z.infer<typeof departmentUpdateSchema>;

export type RoleSelect = z.infer<typeof roleSelectSchema>;
export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;

export type ProjectSelect = z.infer<typeof projectSelectSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;