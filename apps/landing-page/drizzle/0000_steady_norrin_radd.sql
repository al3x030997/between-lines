CREATE TABLE IF NOT EXISTS "waitlist_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_lower" text NOT NULL,
	"kit_subscriber_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"source" text DEFAULT 'landing-v8' NOT NULL,
	"consent_given" boolean NOT NULL,
	"consent_ip" text,
	"consent_user_agent" text,
	"consent_at" timestamp with time zone NOT NULL,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"magic_link_version" integer DEFAULT 1 NOT NULL,
	"unlock_count" integer DEFAULT 0 NOT NULL,
	"last_unlock_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_email_lower_uq" ON "waitlist_subscribers" USING btree ("email_lower");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_public_id_uq" ON "waitlist_subscribers" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waitlist_kit_subscriber_id_ix" ON "waitlist_subscribers" USING btree ("kit_subscriber_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waitlist_status_ix" ON "waitlist_subscribers" USING btree ("status");