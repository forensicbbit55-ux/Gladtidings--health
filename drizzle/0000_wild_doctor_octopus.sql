CREATE TABLE "remedies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"ingredients" text,
	"benefits" text,
	"preparation" text,
	"category" varchar(100),
	"image_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "remedies_slug_unique" UNIQUE("slug")
);
