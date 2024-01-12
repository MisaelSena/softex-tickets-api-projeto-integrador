/*
  Warnings:

  - You are about to drop the column `user_id` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_assignee_id_fkey";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "user_id",
ADD COLUMN     "creator_id" INTEGER NOT NULL,
ALTER COLUMN "assignee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
