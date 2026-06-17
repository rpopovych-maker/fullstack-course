UPDATE "posts" SET "description" = '' WHERE "description" IS NULL;
ALTER TABLE "posts" ALTER COLUMN "description" SET NOT NULL;
