ALTER TABLE "warehouses" ALTER COLUMN "manager_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "inventory_movements" ALTER COLUMN "performed_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transfers" ALTER COLUMN "requested_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "transfers" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_by" SET DATA TYPE text;