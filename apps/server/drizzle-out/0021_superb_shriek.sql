CREATE TABLE "archives" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"original_entity_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"archived_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "archives_entity_idx" ON "archives" USING btree ("entity_type","original_entity_id");