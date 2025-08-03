CREATE TYPE "public"."priority" AS ENUM('Low', 'Medium', 'High', 'Critical');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Admin', 'Manager', 'Employee');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Active', 'Inactive', 'Pending');--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"budget" numeric(12, 2),
	"manager_id" uuid
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'Planning' NOT NULL,
	"priority" "priority" DEFAULT 'Medium' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"budget" numeric(12, 2),
	"department_id" uuid,
	"manager_id" uuid,
	"progress" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"permissions" text[],
	"department_id" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'Employee' NOT NULL,
	"status" "status" DEFAULT 'Active' NOT NULL,
	"department_id" uuid,
	"position" text NOT NULL,
	"salary" numeric(10, 2) NOT NULL,
	"hire_date" timestamp NOT NULL,
	"phone" text,
	"address" text,
	"last_login" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
