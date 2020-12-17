CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."users"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "username" text NOT NULL, "password" text NOT NULL, "email" text NOT NULL, "createdOn" timestamptz NOT NULL DEFAULT now(), "updatedOn" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
