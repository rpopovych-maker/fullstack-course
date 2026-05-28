CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"sub_id" uuid NOT NULL,
	"email" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"sent_at" timestamp NOT NULL,
	"resent_at" timestamp,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invites_subId_unique" UNIQUE("sub_id"),
	CONSTRAINT "invites_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;