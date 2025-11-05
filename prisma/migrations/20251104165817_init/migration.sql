/*
  Warnings:

  - You are about to drop the column `tags` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tags",
ADD COLUMN     "skills" TEXT[];
