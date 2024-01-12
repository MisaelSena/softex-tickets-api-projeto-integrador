/*
  Warnings:

  - Added the required column `user_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "user_id" INTEGER NOT NULL;
