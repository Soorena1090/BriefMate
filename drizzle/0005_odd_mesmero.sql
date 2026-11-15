CREATE TABLE "project_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"analysis_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"overview" text NOT NULL,
	"phases" jsonb NOT NULL,
	"deliverables" jsonb NOT NULL,
	"assumptions" jsonb NOT NULL,
	"risks" jsonb NOT NULL,
	"model" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"analysis_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"introduction" text NOT NULL,
	"project_understanding" text NOT NULL,
	"scope_in" jsonb NOT NULL,
	"scope_out" jsonb NOT NULL,
	"deliverables" jsonb NOT NULL,
	"timeline" jsonb NOT NULL,
	"assumptions" jsonb NOT NULL,
	"model" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_plans" ADD CONSTRAINT "project_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_plans" ADD CONSTRAINT "project_plans_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_plans_project_id_idx" ON "project_plans" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_plans_analysis_id_idx" ON "project_plans" USING btree ("analysis_id");--> statement-breakpoint
CREATE INDEX "proposals_project_id_idx" ON "proposals" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "proposals_analysis_id_idx" ON "proposals" USING btree ("analysis_id");