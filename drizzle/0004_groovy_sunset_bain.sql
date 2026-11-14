CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"brief_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"requirements" jsonb NOT NULL,
	"questions" jsonb NOT NULL,
	"model" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_brief_id_briefs_id_fk" FOREIGN KEY ("brief_id") REFERENCES "public"."briefs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analyses_project_id_idx" ON "analyses" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "analyses_brief_id_idx" ON "analyses" USING btree ("brief_id");