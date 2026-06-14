ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripeCustomerId_unique" UNIQUE("stripe_customer_id");