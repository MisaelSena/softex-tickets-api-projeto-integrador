-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "resolved_at" DROP NOT NULL,
ALTER COLUMN "resolved_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "deleted_at" DROP DEFAULT;
