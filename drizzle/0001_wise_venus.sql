ALTER TABLE "users" ADD COLUMN "role_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";--> statement-breakpoint
DROP TYPE "public"."role";